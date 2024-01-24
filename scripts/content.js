/*
    Construct a Markdown formatted link for text and a link
 */
function makeMdLink(text, url) {
    return '[' + text + '](' + url + ')';
}

/*
    Remove existing added buttons, such as when maximizing one story then another
 */
function removeButtons(container) {
    [].slice.call(container.querySelectorAll('.pbe-title-link, .pbe-markdown-link')).forEach(element => {
        element.remove();
    });
}

/*
    Add the new buttons into the page.
 */
function addButtons(copyLinkButton) {
    const story = copyLinkButton.closest("form.story.model")
    const storyName = story.querySelector("fieldset.name [name='story[name]']").value.replace(/'/g, '’');
    const storyUrl = copyLinkButton.getAttribute('data-clipboard-text');
    const storyMdLink = makeMdLink(storyName, storyUrl);

    // Add button to copy the Markdown link to the clipboard
    const mdLinkButton = document.createElement('button');
    mdLinkButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-link', 'pbe-title-link');
    mdLinkButton.setAttribute('type', 'button');
    mdLinkButton.setAttribute('data-clipboard-text', storyMdLink);
    mdLinkButton.setAttribute('title', 'Copy a Markdown link to this story');
    mdLinkButton.setAttribute('tabIndex', '-1');
    copyLinkButton.parentNode.insertBefore(mdLinkButton, copyLinkButton);

    // Add button to copy the story Title to the clipboard
    const titleButton = document.createElement('button');
    titleButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-title', 'pbe-markdown-link');
    titleButton.setAttribute('type', 'button');
    titleButton.setAttribute('data-clipboard-text', storyName);
    titleButton.setAttribute('title', 'Copy the story title');
    titleButton.setAttribute('tabIndex', '-1');
    copyLinkButton.parentNode.insertBefore(titleButton, copyLinkButton);

    // The existing button to copy the story ID includes a #, which is not
    // needed in most of my use cases. This removes it.
    const idButton = document.querySelector('button.id');
    const storyId = idButton.getAttribute('data-clipboard-text');
    idButton.setAttribute('data-clipboard-text', storyId.replace(/#/g, ''));
}

function mutationCallback(mutationsList, observer) {
    const selector = '.clipboard_button';
    mutationsList.forEach(mutation => {
        if (mutation.target.matches('.story, .main.maximized') && mutation.target.querySelector(selector)) {
            removeButtons(mutation.target);
            addButtons(mutation.target.querySelector(selector));
        }
    });
    // we never call observer.disconnect() in case we open several stories throughout the session
}

const observer = new MutationObserver(mutationCallback);
observer.observe(document.body, {childList: true, subtree: true});
