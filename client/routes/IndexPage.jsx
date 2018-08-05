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

    openModule = (Module, left) => ev => {
		ev.stopPropagation();
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

				<div className="modules left bottom">
                    {modules.map(Module => <ModuleButton Module={Module} key={Module.name} onClick={this.openModule(Module, true)}/>)}
				</div>
                <div className="modules right bottom">
                    {modules.map(Module => <ModuleButton Module={Module} key={Module.name} onClick={this.openModule(Module, false)}/>)}
                </div>
                <div className="modules left top">
                    {modules.map(Module => <ModuleButton Module={Module} key={Module.name} onClick={this.openModule(Module, true)}/>)}
                </div>
                <div className="modules right top">
                    {modules.map(Module => <ModuleButton Module={Module} key={Module.name} onClick={this.openModule(Module, false)}/>)}
                </div>
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
