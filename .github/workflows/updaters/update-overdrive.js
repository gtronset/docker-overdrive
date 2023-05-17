const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = async ({github, core}) => {
    try {

        const baseimageOwner = "chbrown";
        const baseimageRepo = "overdrive";
        const versionFile = "version.yaml";
        const dockerfile = "Dockerfile";

        const yamlContents = yaml.load(fs.readFileSync(versionFile, 'utf8'));

        const {overdrive} = yamlContents;

        const tags = await github.rest.repos.listTags({
            owner: baseimageOwner,
            repo: baseimageRepo,
        });

        const tag_version = tags.data[0].name;
        const tag_zip_file = tags.data[0].zipball_url;

        console.log(`Existing/local version: ${overdrive} | Remote version: ${tag_version}`);

        if(overdrive !== tag_version){
            console.log("Overdrive version update. Updating...");

            /* Update the Version File */
            yamlContents.overdrive = tag_version;
            fs.writeFileSync(versionFile, yaml.dump(yamlContents));

            /* Update the Dockerfile */
            fs.readFile(dockerfile, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                zipfile_base = tag_zip_file.replace(tag_version, '')
                const zipfile_regex = new RegExp(`${zipfile_base}${overdrive}`);
                const result = data.replace(zipfile_regex, tag_zip_file);

                fs.writeFile(dockerfile, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            console.log("Updated Version file and Dockerfile.");
        } else {
            console.log("Overdrive is already up-to-date.");
        }

    } catch (error) {
        core.setFailed(error.message);
    }

}
