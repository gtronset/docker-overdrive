const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = async ({github, context, core}) => {
    const versionFile = "version.yaml";

    const yamlContents = yaml.load(fs.readFileSync(versionFile, 'utf8'));
    const {overdrive, docker_overdrive, alpine_version, lsio_version, current_release} = yamlContents;

    try {
        const releaseBody = `# Release Notes (${current_release})\n\n` +
            `## Version Info\n` +
            `* [Overdrive](https://github.com/chbrown/overdrive): \`v${overdrive}\`\n` +
            `* [LinuxServer \`alpine\`](https://hub.docker.com/r/lsiobase/alpine):` +
            ` \`${alpine_version}-ls${lsio_version}\`\n` +
            `* \[\`docker-overdrive\`](https://github.com/gtronset/docker-overdrive) release: \`${docker_overdrive}\` (\`ba${docker_overdrive}\`)` +
            `\n\n`;

        await github.rest.repos.createRelease({
            draft: false,
            generate_release_notes: true,
            body: releaseBody,
            name: current_release,
            owner: context.repo.owner,
            prerelease: false,
            repo: context.repo.repo,
            tag_name: current_release,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}
