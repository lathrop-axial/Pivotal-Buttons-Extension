/*
    Get the story name from DOM
 */
function getStoryName(story) {
    return story.querySelector("fieldset.name [name='story[name]']").value;
}

/*
    Construct a Markdown formatted link for text and a link
 */
function makeMdLink(text, url) {
    return '[' + text + '](' + url + ')';
}

/*
    Add the new buttons into the page.
 */
function addButtons() {
    // Find the first button that copies to clipboard on the page,
    // to use as an anchor for where we should put the new buttons.
    const copyLinkButton = document.querySelector('.clipboard_button');
    const story = copyLinkButton.closest("form.story.model")

    const storyName = story.querySelector("fieldset.name [name='story[name]']").value;
    const storyUrl = copyLinkButton.getAttribute('data-clipboard-text');
    const storyMdLink = makeMdLink(storyName, storyUrl);

    // Add button to copy the Markdown link to the clipboard
    const mdLinkButton = document.createElement('button');
    mdLinkButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-link');
    mdLinkButton.setAttribute('type', 'button');
    mdLinkButton.setAttribute('id', 'title-link');
    mdLinkButton.setAttribute('data-clipboard-text', storyMdLink);
    mdLinkButton.setAttribute('title', 'Copy a Markdown link to this story');
    mdLinkButton.setAttribute('tabIndex', '-1');
    copyLinkButton.parentNode.insertBefore(mdLinkButton, copyLinkButton);

    // Add button to copy the story Title to the clipboard
    const titleButton = document.createElement('button');
    titleButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-title');
    titleButton.setAttribute('type', 'button');
    titleButton.setAttribute('id', 'md-link');
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
    if (!document.querySelector('#md-link')) {
        if (document.querySelector(selector)) {
            addButtons();
            return;
        }

        function mutationCallback(mutationsList, observer) {
            if (document.querySelector(selector)) {
                addButtons();
                observer.disconnect();
            }
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
