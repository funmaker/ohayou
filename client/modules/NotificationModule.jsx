import React from 'react';
import {Icon} from "semantic-ui-react";

export default class NotificationModule extends React.Component {
    componentDidMount(){
        this.ws = new WebSocket("ws://funmaker.me:9039");
        console.log(this.ws);

        this.ws.onopen = () => {

            const msg = {
                command: 'fetch',
                flat: true,
                feeds: ["*"],
            };

            this.ws.send(JSON.stringify(msg));
        };


        this.ws.onmessage = (event) => {

            let e = JSON.parse(event.data);
            console.log(e);

        }

        this.ws.onmessage


    }

    render() {
        return "kek";
    }

    static renderButton() {
        return <Icon  name='rss' />;
    }
}
// Send text to all users through the server
function sendText() {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var msg = {
        type: "message",
        text: document.getElementById("text").value,
        id:   clientID,
        date: Date.now()
    };

    // Send the msg object as a JSON-formatted string.
    exampleSocket.send(JSON.stringify(msg));

    // Blank the text input element, ready to receive the next line of text from the user.
    document.getElementById("text").value = "";
}