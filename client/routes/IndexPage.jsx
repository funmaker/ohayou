import React from 'react'
import {fetchInitialData, getInitialData} from "../helpers/initialData";
import UploadModule from '../modules/UploadModule';
import NotificationModule from '../modules/NotificationModule';
import ModuleButton from "../components/ModuleButton";

const busyBraile = ['⠙', '⠸', '⢰', '⣠', '⣄', '⡆', '⠇', '⠋'];

const modules = [
	UploadModule,
    NotificationModule,
];

const joinTrue = obj => Object.entries(obj).filter(([k, v]) => v).map(([k, v]) => k).join(" ");

const ModuleButtons = ({moduleNames, direction, openModule, dragModule, dropModule, dragging}) => (
    <div className={`ModuleButtons ${direction}`} >
		{moduleNames.map(modName => <ModuleButton Module={modules.find(mod => mod.name === modName)}
												  key={modName}
												  className={dragging === modName ? "hidden" : "visible"}
												  onClick={openModule(modName, direction.toLowerCase().includes("left"))}
												  onDragStart={dragModule(modName)}
                                                  onDragEnd={dropModule}
												  draggable/>)}
	</div>
);

const ModuleButtonDropZone = ({direction, dropping, enterDropZone, leaveDropZone, dropDropZone}) => (
	<div className={`ModuleButtonDropZone ${direction} ${dropping === direction ? "active" : ""}`}
		 onDragOver={ev => ev.preventDefault()}
		 onDragEnter={enterDropZone(direction)}
		 onDragLeave={leaveDropZone}
		 onDrop={dropDropZone(direction)}/>
);

export default class IndexPage extends React.Component {
	constructor() {
		super();
		
		this.state = {
			...getInitialData(),
			counter: 0,
            LeftModule: null,
			leftModuleOpen: false,
			RightModule: null,
            rightModuleOpen: false,
			buttons: {
                topLeft: [],
                topRight: [],
                bottomLeft: modules.map(mod => mod.name),
                bottomRight: [],
			},
			dragging: null,
            dropping: null,
		};
	}
	
	async componentDidMount() {
		this.setState({
			...(await fetchInitialData()),
		});
		this.interval = setInterval(() => {
			this.setState({counter: (this.state.counter + 1) % busyBraile.length})
		}, 100);
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	}

    openModule = (modName, left) => ev => {
		ev.stopPropagation();
		const Module = modules.find(mod => mod.name === modName);
		if(left) {
			this.setState({
				LeftModule: Module,
                leftModuleOpen: true,
			});
		} else {
            this.setState({
                RightModule: Module,
                rightModuleOpen: true,
            });
		}
	};

	dragModule = modName => ev => {
		ev.dataTransfer.setData("modName", modName);
		this.setState({
			dragging: modName,
		})
	};

    dropModule = ev => {
        this.setState({
            dragging: null,
        })
    };

    enterDropZone = direction => ev => {
        this.setState({
            dropping: direction,
        })
    };

    leaveDropZone = ev => {
        this.setState({
            dropping: null,
        })
    };

    dropDropZone = direction => ev => {
    	const buttons = {...this.state.buttons};
    	for(let dir in buttons) {
    		buttons[dir] = buttons[dir].filter(modName => modName !== this.state.dragging);
		}
		buttons[direction].push(this.state.dragging);
    	this.setState({
			buttons,
    		dropping: null,
			dragging: null,
    	})
    };

	closeModules = ev => {
        this.setState({
            leftModuleOpen: false,
            rightModuleOpen: false,
        });
	};
	
	render() {
		const {LeftModule, leftModuleOpen, RightModule, rightModuleOpen} = this.state;

		return (
			<div className="IndexPage" onClick={this.closeModules}>
                <div className="content">
                    {busyBraile[this.state.counter]}
                    {this.state.kek}
                    {busyBraile[this.state.counter]}
                </div>

                <ModuleButtons direction="topLeft" moduleNames={this.state.buttons.topLeft} openModule={this.openModule}
							   dragModule={this.dragModule} dragging={this.state.dragging} dropModule={this.dropModule} />
                <ModuleButtons direction="topRight" moduleNames={this.state.buttons.topRight} openModule={this.openModule}
							   dragModule={this.dragModule} dragging={this.state.dragging} dropModule={this.dropModule} />
                <ModuleButtons direction="bottomLeft" moduleNames={this.state.buttons.bottomLeft} openModule={this.openModule}
							   dragModule={this.dragModule} dragging={this.state.dragging} dropModule={this.dropModule} />
                <ModuleButtons direction="bottomRight" moduleNames={this.state.buttons.bottomRight} openModule={this.openModule}
							   dragModule={this.dragModule} dragging={this.state.dragging} dropModule={this.dropModule} />

				{this.state.dragging ? (
					<React.Fragment>
                        <ModuleButtonDropZone direction="topLeft" dropping={this.state.dropping}
                                              enterDropZone={this.enterDropZone} leaveDropZone={this.leaveDropZone} dropDropZone={this.dropDropZone} />
                        <ModuleButtonDropZone direction="topRight" dropping={this.state.dropping}
											  enterDropZone={this.enterDropZone} leaveDropZone={this.leaveDropZone} dropDropZone={this.dropDropZone} />
                        <ModuleButtonDropZone direction="bottomLeft" dropping={this.state.dropping}
											  enterDropZone={this.enterDropZone} leaveDropZone={this.leaveDropZone} dropDropZone={this.dropDropZone} />
                        <ModuleButtonDropZone direction="bottomRight" dropping={this.state.dropping}
											  enterDropZone={this.enterDropZone} leaveDropZone={this.leaveDropZone} dropDropZone={this.dropDropZone} />
					</React.Fragment>
				) : null}

				<div className={leftModuleOpen ? "modulePanel left open" : "modulePanel left"}>
					{LeftModule ? <LeftModule /> : null}
				</div>
                <div className={rightModuleOpen ? "modulePanel right open" : "modulePanel right"}>
                    {RightModule ? <RightModule /> : null}
				</div>
			</div>
		)
	}
}
