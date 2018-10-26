import React from 'react';
import {Icon} from "semantic-ui-react";

export default class NotificationModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: [],
        };

    }
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

            this.setState({
                entries: [
                    ...e.status.sort((a, b) => a.timestamp - b.timestamp),
                    ...e.notifications.sort((a, b) => a.timestamp - b.timestamp),
                ],
            });
        };

    }

    render() {
        return this.state.entries.map(entry => <NotificationEntry entry={entry}/>);
    }

    static renderButton() {
        return <Icon  name='rss' />;
    }
}

function NotificationEntry({entry}) {
    return (
        <div className="NotificationEntry">
            <a>
                <span>{entry.feedName}</span>
                    {entry.description}
                <span>{entry.time}</span>
            </a>
        </div>
    );
}

