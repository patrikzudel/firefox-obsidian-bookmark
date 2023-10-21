browser.pageAction.onClicked.addListener(clipPage);

async function clipPage() {
  const { clipper_opts_vault_name: vaultName } = await browser.storage.local.get('clipper_opts_vault_name');
  const { clipper_opts_path: vaultPath } = await browser.storage.local.get('clipper_opts_path');

  if (!vaultName || !vaultPath) {
    console.log("Need to fill out settings!")
    browser.runtime.openOptionsPage()
    return;
  }

  browser.tabs.query({currentWindow: true, active: true}).then(async (tabs) => {
    const { url, title } = tabs[0];
    let description = "No description..."

    await fetch(url) // replace with the URL you need
    .then(response => response.text())
    .then(html_string => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html_string, 'text/html');
      let metaDescription = doc.querySelector('meta[name="description"]');
      if (metaDescription) {
        description = metaDescription.getAttribute('content');
      } else {
        console.log('No description found');
      }
    }).catch(err => console.log('Failed to fetch page: ', err));
  
    let str = `\n## ${title}\n*${description}*\n`
    // let newStr = str.replace(/[^a-zA-Z* #\n|-]/g, "").replace(/ /g, "%2520").replace(/#/g, "%23").replace(/\n/g, "%0A").replace(/\*/g, "%2A").replace(/\|/g, "%7C");
    let newStr = encodeURIComponent(str);
    let newUrl = encodeURIComponent(url);

    const obsidianURI = `obsidian://advanced-uri?vault=${vaultName}&filepath=${vaultPath}&data=${newStr}${newUrl}&mode=append`

      browser.tabs.create({
        url: obsidianURI
      })
  }, console.error);
}
