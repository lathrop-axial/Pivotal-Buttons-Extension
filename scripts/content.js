/*
    Construct a Markdown formatted link for text and a link
 */
function makeMdLink(text, url) {
    return '[' + text + '](' + url + ')';
}

/*
    Add the new buttons into the page.
 */
function addButtons(copyLinkButton) {
    const story = copyLinkButton.closest("form.story.model")
    const storyName = story.querySelector("fieldset.name [name='story[name]']").value;
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

/*
    Wait for the anchor element to be found in the DOM.

    When the extension first loads, it will not necessarily
    be there yet.
 */
function waitFor(selector) {
    if (!document.querySelector('.pbe-markdown-link')) {
        if (document.querySelector(selector)) {
            addButtons(document.querySelector(selector));
            return;
        }

        function mutationCallback(mutationsList, observer) {
            mutationsList.forEach(mutation => {
                if (mutation.target.matches('.story') && mutation.target.querySelector(selector)) {
                    addButtons(mutation.target.querySelector(selector));
                }
            });
            // we never call observer.disconnect() in case we open several stories throughout the session
        }

        const observer = new MutationObserver(mutationCallback);
        observer.observe(document.body, {childList: true, subtree: true});
    }
}

// It seems like we can't immediately make a MutationObserver
// and have to wait a bit for the DOM to be ready.
// It worked on one Pivotal Project, but not another, even
// in the same browser window.
// 500ms was chosen after some testing.
setTimeout(() => {
    waitFor('.clipboard_button');
}, 500);
