async function clipPage(url, title, tags, description) {
  const { clipper_opts_vault_name: vaultName } = await browser.storage.local.get('clipper_opts_vault_name');
  const { clipper_opts_path: vaultPath } = await browser.storage.local.get('clipper_opts_path');

  if (!vaultName || !vaultPath) {
    console.log("Need to fill out settings!")
    browser.runtime.openOptionsPage()
    return;
  }

  let str = `\n## ${title} ${tags}\n`
  if (description !== "") {
    str = str + `*${description}*\n`
  }
  let newStr = encodeURIComponent(str);
  let newUrl = encodeURIComponent(url);

  const obsidianURI = `obsidian://advanced-uri?vault=${vaultName}&filepath=${vaultPath}&data=${newStr}${newUrl}&mode=append`

  browser.tabs.create({
    url: obsidianURI
  })
}


window.addEventListener('DOMContentLoaded', async () => {
  let url, title;
  await browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    url = tabs[0].url;
    title = tabs[0].title;
  }, console.error);
  let description = ""
  document.querySelector('#description').placeholder = "Loading...";

  await fetch(url)
    .then(response => response.text())
    .then(html_string => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html_string, 'text/html');
      let metaDescription = doc.querySelector('meta[name="description"]');
      if (metaDescription) {
        description = metaDescription.getAttribute('content');
      } else {
        description = ""
        console.log('No description found');
      }
    }).catch(err => {
      description = ""
      console.log('Failed to fetch page: ', err)
    }
    );

  document.querySelector('#description').placeholder = "No description...";
  document.querySelector('#description').value = description;
  document.querySelector('#title').value = title;

  function addBookmarkToObsidian() {
    const tags = document.querySelector('#tags').value;
    const title = document.querySelector('#title').value;
    const desc = document.querySelector('#description').value;
    clipPage(url, title, tags, desc)
  }

  document
    .querySelector('#submit-bookmark')
    .addEventListener('click', addBookmarkToObsidian);

  document.querySelector('#tags').addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
      addBookmarkToObsidian();
    }
  })

  // browser.runtime.onMessage.addListener(message => {
  //   if(message.message === 'dropdown_data') {
  //     const categorySelect = document.querySelector('#topic-selector');
  //     const files = message.data;
  //     sortByKey(files, 'fileName')
  //     for (file of files) {
  //       const opt = document.createElement('option');
  //       opt.text = file.fileName;
  //       opt.value = file.filePath;
  //       categorySelect.add(opt);
  //     }
  //   }
  // })  

  // browser.runtime.sendMessage({message: 'ready'});
});
