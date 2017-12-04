import React from "../../lib/react.js";

import User from "../models/user.js";
import Notebook from "../models/notebook.js";

import ToolbarView from "./subviews/toolbar";
import * as Utils from "../utils.js";

export default class AdminView extends React.Component {

	constructor(props) {
		super(props);

		this.state = { close : false, manager : true, users : [], notebooks : [], clickedNotebook : false };

		this.parent = props.parentHandler;

		this.user = this.user.bind(this);
		this.settings = this.settings.bind(this);
		this.logout = this.logout.bind(this);
		this.back = this.back.bind(this);

		this.parentToolbar = { backCallback : this.back, logoutCallback : this.logout, user_hash : this.parent.getUser().user_hash, manager : this.back, settings : this.settings};
	}

	componentDidMount() {

		Utils.post("getCompanyUsers", { user_hash : this.parent.getUser().user_hash }, function(json) {
			json.users.forEach(function(user) {
				Utils.post("user", { user_hash : user }, function(json) {
				    if(json.user_hash !== this.parent.getUser().user_hash)
                        this.setState({ users : this.state.users.concat(new User(json)) });
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}

	user(user) {
		this.setState({ notebooks : [] });
		user.notebooks.forEach(function(notebook_hash) {
			Utils.post("getNotebook", { user_hash : user.user_hash, notebook_hash : notebook_hash}, function(json) {
				this.setState({ notebooks : this.state.notebooks.concat(new Notebook(notebook_hash, json)), clickedNotebook : true });
			}.bind(this));
		}.bind(this));
	}

	settings(mode) {
		const imageSetting = mode === "stateInline " ? "inline" : "below";
		Utils.post("formatAll", { user_hash : this.parent.getUser().user_hash, settings : { image : imageSetting }});
	}

	back() {
		this.setState({ pageState : "stateExit stateTransition ", manager : false });

		setTimeout(function() {
			this.parent.back();
		}.bind(this), 300);
	}

	logout() {
		this.setState({ pageState : "stateExit stateTransition ", close : true });

		setTimeout(function(){
			this.parent.logout();
		}.bind(this), 300);
	}

	render() {
		return (<div className="notebooks-view">
			<ToolbarView dataIntro="Click" load={true}
			             dataStep="1" page={this.parent.getUser().company_name}
			             parentHandler={this.parentToolbar} visible={this.state.close} hasBack={true} isManagerUI={this.state.manager ? 2 : 0} />
			<div className="admin-ui container">
				<div className="admin-ui user-list">
                    <div className="admin-ui email-container">
                        {this.state.users.map(user => (
                            <div className="admin-ui email-div" data-value={user.user_hash} key={user.user_hash}><a href="#" onClick={(e) => (e.preventDefault(), this.user(user))}>{user.email}</a></div>
                        ))}
                    </div>
				</div>
				<div className="admin-ui permission-selector">
                    <div className="admin-ui checklist-div">
                        {!this.state.clickedNotebook ?
                            <p>Select a user to see their notebooks</p> :
                            this.state.notebooks.map(notebook => (
                                <div className="admin--user" key={notebook.notebook_hash}>{notebook.name}</div>
                            ))
                        }
                    </div>
				</div>
			</div>
		</div>);
	}

}
