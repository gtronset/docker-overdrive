const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = async ({github, context, core}) => {
    try {

        const {owner, repo} = context.repo;
        const versionFile = "version.yaml";

        const yamlContents = yaml.load(fs.readFileSync(versionFile, 'utf8'));
        const {overdrive, docker_overdrive, lsio_version} = yamlContents;

        /* Make available the following variables in subsequent step(s) */
        core.exportVariable('PROJECT_VERSION', overdrive);
        core.exportVariable('LSIO_VERSION', lsio_version);

        const latest_release_response = await github.rest.repos.getLatestRelease({
            owner: owner,
            repo: repo,
        });

        const latest_release_tag_name = latest_release_response.data.tag_name;

        console.log("Latest release: ", latest_release_tag_name);

        const compare_commits_response = await github.rest.repos.compareCommitsWithBasehead({
            owner: owner,
            repo: repo,
            basehead: `${latest_release_tag_name}...HEAD`,
        });

        const total_commits = compare_commits_response.data.total_commits;
        const commits = compare_commits_response.data.commits;

        if (total_commits === 0){
            console.log(`No new commits since last release (${latest_release_tag_name}).`);
            return;
        }

        core.exportVariable('RELEASE_NEEDED', true);
        core.exportVariable('OLD_TAG_NAME', latest_release_tag_name);

        console.log("Commits since last release: ", total_commits);

        const new_docker_overdrive = parseInt(docker_overdrive) + 1;

        core.exportVariable('NEW_DOCKER_OVERDRIVE', new_docker_overdrive);

        const new_tag_name = `v${overdrive}-do${new_docker_overdrive}`;
        console.log("New release tag: ", new_tag_name);

        core.exportVariable('TAG_NAME', new_tag_name);


        /* Update the Version File */
        yamlContents.docker_overdrive = new_docker_overdrive
        yamlContents.previous_release = latest_release_tag_name
        yamlContents.current_release = new_tag_name
        fs.writeFileSync(versionFile, yaml.dump(yamlContents));

    } catch (error) {
        core.setFailed(error.message);
    }

}
