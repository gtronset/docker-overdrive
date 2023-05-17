const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = async ({github, core}) => {
    try {

        const baseimageOwner = "linuxserver";
        const baseimageRepo = "docker-baseimage-alpine";
        const versionFile = "version.yaml";
        const dockerfile = "Dockerfile";

        const yamlContents = yaml.load(fs.readFileSync(versionFile, 'utf8'));

        const {alpine_version, lsio_version} = yamlContents;

        const latest_release_response = await github.rest.repos.getLatestRelease({
            owner: baseimageOwner,
            repo: baseimageRepo,
        });

        const latest_release_tag_name = latest_release_response.data.tag_name;
        console.log(latest_release_tag_name)

        const version_regex = new RegExp(`([0-9]+\.[0-9]+)-[0-9a-f]{8}-ls([0-9]+)`);
        const latest_release_versions = latest_release_tag_name.match(version_regex);

        console.log(`Existing/local version: ${alpine_version}-ls${lsio_version} | `
          + `Remote version: ${latest_release_versions[1]}-ls${latest_release_versions[2]}`);

        if(alpine_version !== latest_release_versions[1] || lsio_version !== latest_release_versions[2]){
            console.log("BaseImage version update. Updating...");

            /* Update the Version File */
            yamlContents.alpine_version = parseInt(latest_release_versions[1]);
            yamlContents.lsio_version = parseInt(latest_release_versions[2]);
            fs.writeFileSync(versionFile, yaml.dump(yamlContents));

            /* Update the Dockerfile */
            fs.readFile(dockerfile, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                const result = data.replace(version_regex, latest_release_tag_name);

                fs.writeFile(dockerfile, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            console.log("Updated Version file and Dockerfile.");
        } else {
            console.log("BaseImage is already up-to-date.");
        }

    } catch (error) {
        core.setFailed(error.message);
    }

}
