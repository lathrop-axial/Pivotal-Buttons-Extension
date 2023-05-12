function getStoryName(story) {
    return story.querySelector("fieldset.name [name='story[name]']").value;
}
function getStoryLink(story) {
    const storyUrl = story.querySelector('button.story-url').getAttribute('data-clipboard-text');
    return '[' + getStoryName(story) + '](' + storyUrl + ')';
}

function addButtons() {
    const copyLinkButton = document.querySelector('.clipboard_button');
    copyLinkButton.classList.add('story-url');
    const story = copyLinkButton.closest("form.story.model")

    // Add button to copy the story Title to the clipboard
    const titleButton = document.createElement('button');
    titleButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-title');
    titleButton.setAttribute('type', 'button');
    titleButton.setAttribute('id', 'md-link');
    titleButton.setAttribute('data-clipboard-text', getStoryName(story));
    titleButton.setAttribute('title', 'Copy the story title');
    titleButton.setAttribute('tabIndex', '-1');
    copyLinkButton.parentNode.insertBefore(titleButton, copyLinkButton);

    // Add button to copy the Markdown link to the clipboard
    const mdLinkButton = document.createElement('button');
    mdLinkButton.classList.add('autosaves', 'clipboard_button', 'link', 'left_endcap', 'hoverable', 'story-link');
    mdLinkButton.setAttribute('type', 'button');
    mdLinkButton.setAttribute('id', 'title-link');
    mdLinkButton.setAttribute('data-clipboard-text', getStoryLink(story));
    mdLinkButton.setAttribute('title', 'Copy a Markdown link to this story');
    mdLinkButton.setAttribute('tabIndex', '-1');
    copyLinkButton.parentNode.insertBefore(mdLinkButton, copyLinkButton);

    const idButton = document.querySelector('button.id');
    const storyId = idButton.getAttribute('data-clipboard-text');
    idButton.setAttribute('data-clipboard-text', storyId.replace(/#/g, ''));
}

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

setTimeout(() => {
    waitFor('.clipboard_button');
}, 500);
