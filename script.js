function initEmbeddedMessaging() {
    try {
		 // Add a timeout to check for failure
        const initTimeout = setTimeout(() => {
            console.error('[Salesforce Chat] Initialization failed: The "onEmbeddedMessagingReady" event was not received within 10 seconds.');
        }, 10000); // 10-second timeout
		
        window.embeddedservice_bootstrap.settings.language = 'en_US';
        embeddedservice_bootstrap.settings.enableUserInputForConversationWithBot = false;
        window.embeddedservice_bootstrap.init(
            '00DGA000009nelv',
			'Best_Auto_Service_Agent',
			'https://huaxu-241209-309-demo.my.site.com/ESWBestAutoServiceAgen1747888067155',
			{
				scrt2URL: 'https://huaxu-241209-309-demo.my.salesforce-scrt.com'
			}
        );
		// Listen for the success event
        window.addEventListener("onEmbeddedMessagingReady", () => {
            console.log("[Salesforce Chat] Initialization successful. The client is ready.");
            clearTimeout(initTimeout); // Clear the failure timeout
            
            // Set the target element *after* initialization is confirmed
            embeddedservice_bootstrap.settings.targetElement = document.body.querySelector("#embeddedMessagingContainer");
        });
		
    } catch (err) {
        console.error('Error loading Embedded Messaging: ', err);
    }
}

window.addEventListener("onEmbeddedMessagingReady", () => {
    embeddedservice_bootstrap.settings.targetElement = document.body.querySelector("#embeddedMessagingContainer");
});

//Not using handleSearch() for now
//Handle search button click
var query;

function handleSearch() {
    query = document.getElementById('queryInput').value;
    if(query.trim()) {
        //Show the chat modal
        const chatModal = document.getElementById('embeddedMessagingContainer');
        chatModal.classList.add('show');

        //Setting up the prechat form
        embeddedservice_bootstrap.prechatAPI.setVisiblePrechatFields({
            "_firstName": {
                "value": "Hua",
                "isEditableByEndUser": false
            },
            "_lastName": {
                "value": "Xu",
                "isEditableByEndUser": false
            },
            "_email": {
                "value": "hua.xu@salesforce.com",
                "isEditableByEndUser": false
            }
        });
        embeddedservice_bootstrap.prechatAPI.setHiddenPrechatFields({
            "ServiceID": "Test123"
        });

      // Instead of calling launchChat(), find the button and click it.
        const chatButton = document.getElementById('chatButton');
        if (chatButton) {
            chatButton.click();
        } else {
            console.error('[Launch Error] The #chatButton element could not be found in the DOM.');
        }
		
    } else {
        alert('Please enter a search query!');
    }
}

// NEW: Add this function from the Salesforce example.
function launchChat() {
    // First, get the user's query from the input field.
    query = document.getElementById('queryInput').value;

    embeddedservice_bootstrap.utilAPI.launchChat()
        .then(() => {
            console.log("Chat client launched successfully.");
            // Optional: disable the button after launch
            document.getElementById('launchChatButton').disabled = true;
        }).catch((error) => {
            console.error("Chat client failed to launch.", error);
        }).finally(() => {
            console.log("Attempted to launch chat.");
        });
}

window.addEventListener("onEmbeddedMessagingConversationParticipantChanged", (event) => {
    const participantChangedEntry = JSON.parse(event.detail.conversationEntry.entryPayload).entries[0];
    console.log("participantChangedEntry:" + JSON.stringify(participantChangedEntry));

    if(participantChangedEntry.operation === "add" && participantChangedEntry.participant.role === "Chatbot") {
        // Delay the execution by 2 seconds
        setTimeout(() => {
            embeddedservice_bootstrap.utilAPI.sendTextMessage(query);//pass the initial query automatically to ASA
        }, 1500);
    }
});
