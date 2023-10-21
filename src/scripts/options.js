document.getElementById('clipper_options')
  .addEventListener('submit', () => saveOptions());

browser.storage.local.get("clipper_opts_vault_name").then(resp => {
  const { vaultName, clipper_opts_vault_name } = resp;

  if (clipper_opts_vault_name !== undefined)
    document.getElementById('clipper_opts_vault_name').value = clipper_opts_vault_name;
})

browser.storage.local.get("clipper_opts_path").then(resp => {
  const { vaultPath, clipper_opts_path } = resp;

  if (clipper_opts_path !== undefined)
  document.getElementById('clipper_opts_path').value = clipper_opts_path;
})

function saveOptions(){
  const vaultName = document.getElementById('clipper_opts_vault_name').value;
  const vaultPath = document.getElementById('clipper_opts_path').value;

  browser.storage.local.set({ clipper_opts_vault_name: vaultName });
  browser.storage.local.set({ clipper_opts_path: vaultPath });
}
