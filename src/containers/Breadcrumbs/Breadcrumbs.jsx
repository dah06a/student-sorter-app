import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../utils/sharedFunctions';

import './Breadcrumbs.css';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Select from '../../components/UI/Select/Select';

class Breadcrumbs extends Component {
    state = {
        showModal: false,
        modalType: "choose",
        showWarning: false,
        selection: "",
    }

    fromSaveToOptions = (saveObject) => {
        if (Object.keys(saveObject).length === 0) {
            return ["No Start Settings Found"];
        } else {
            const allOptions = Object.values(saveObject).map(value => value.title);
            return allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }
    }

    scheduleSelectHandler = (selectedSchedule) => {
        if (this.props.history.location.pathname === "/new-sort/schedule") {
            this.setState({showModal: true, modalType: "choose", selection: selectedSchedule});
        } else if (this.props.start.timeSlots.length > 1) {
            this.setState({showModal: true, modalType: "schedule", selection: selectedSchedule});
        } else {
            this.setScheduleWithOriginalHandler(selectedSchedule);
        }
    }

    setScheduleWithOriginalHandler = (selectedSchedule) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, selectedSchedule);
        this.props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        this.props.onApplySelectedScheduleOption(selectedSchedule);
        this.props.history.replace({pathname: "/new-sort/schedule", start: {transition: "fromStart"}});
    }

    setScheduleWithNewHandler = () => {
        this.setState({showModal: false});
        this.props.onIntegrateScheduleOption(this.state.selection, this.props.start.timeSlots);
    }

    studentSelectHandler = (selectedStudentList) => {
        if (this.props.history.location.pathname === "/new-sort/students") {
            this.setState({showModal: true, modalType: "choose", selection: selectedStudentList});
        } else if (this.props.start.timeSlots.length > 1 || this.props.schedule.schedule.length > 1) {
            this.setState({showModal: true, modalType: "students", selection: selectedStudentList});
        } else {
            this.setStudentsWithOriginalHandler(selectedStudentList);
        }
    }

    setStudentsWithOriginalHandler = (selectedStudentList) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, selectedStudentList);
        this.props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        this.props.onApplySelectedScheduleOption(saved.matchingSchedule);
        this.props.onApplySelectedStudentListOption(selectedStudentList);
        this.props.history.replace({pathname: "/new-sort/students", state: {transition: "toStudents"}});
    }

    setStudentsWithNewHandler = () => {
        this.setState({showModal: false});
        const currentOptions = this.props.schedule.schedule.map(option => option.label);
        this.props.onIntegrateStudentListOption(this.state.selection, this.props.start.studentChoices, currentOptions);
    }

    render () {

        let saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, this.state.selection);
        if (this.props.history.location.pathname === "/new-sort/students") {
            saved = getMostRecentSaveOf(this.props.students.savedStudentLists, this.state.selection);
        }

        let modalContent = <React.Fragment>
            <div>
                <h3>Use With Matching Or New?</h3>
                <p>Saved work can be loaded with its matching data, or with the current new data.</p>
                <p>Selected Work To Load: <strong>{this.state.selection}</strong></p>

                <div className="SettingsDisplay">
                    <div className="SettingsLeft">
                        <h4 style={{color: "var(--Success)", backgroundColor: "var(--Dark)"}}>New Data</h4>
                        <p>Settings: <strong>{this.props.start.title}</strong></p>
                        {this.props.history.location.pathname === "/new-sort/students" ? <p>Schedule: <strong>{this.props.schedule.title}</strong></p> : null}
                        <Button
                            type="Success"
                            enter={() => this.setState({showWarning: true})}
                            leave={() => this.setState({showWarning: false})}
                            clicked={() => {
                                if (this.props.history.location.pathname === "/new-sort/schedule") this.setScheduleWithNewHandler();
                                if (this.props.history.location.pathname === "/new-sort/students") this.setStudentsWithNewHandler();
                            }}
                            >USE WITH NEW
                        </Button>
                    </div>

                    <div className="Divider" />

                    <div className="SettingsRight">
                        <h4 style={{color: "var(--Primary)", backgroundColor: "var(--Dark)"}}>Matching Data</h4>
                        <p>Settings: <strong>{saved.matchingStartSettings}</strong></p>
                        {this.props.history.location.pathname === "/new-sort/students" ? <p>Schedule: <strong>{saved.matchingSchedule}</strong></p> : null}
                        <Button
                            type="Info"
                            clicked={() => {
                                if (this.props.history.location.pathname === "/new-sort/schedule") this.setScheduleWithOriginalHandler(this.state.selection);
                                if (this.props.history.location.pathname === "/new-sort/students") this.setStudentsWithOriginalHandler(this.state.selection);
                            }}
                            >USE WITH MATCHING
                        </Button>
                    </div>

                </div>
            </div>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >CANCEL
            </Button>
            {this.state.showWarning ? <p><span style={{color: "red"}}>If you choose to "USE NEW" and overwrite your save with the same name, your original settings will be replaced.</span></p> : null}
        </React.Fragment>

        if (this.state.modalType !== "choose") modalContent = <React.Fragment>
            <h3>Are You Sure You Want To Leave?</h3>
            <p>By loading a schedule or student list, you will lose your current data.</p>
            <Button
                type="Success"
                clicked={() => {
                    if (this.state.modalType === "schedule") this.setScheduleWithOriginalHandler(this.state.selection);
                    if (this.state.modalType === "students") this.setStudentsWithOriginalHandler(this.state.selection);
                }}
                >CONTINUE
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >CANCEL
            </Button>
        </React.Fragment>

        let startSelectLabel = "Load Start Settings";
        if (this.props.start.loading) startSelectLabel = "LOADING...";
        if (this.props.start.title.trim() !== "") startSelectLabel = this.props.start.title;

        let startCrumb = <Button clicked={() => this.props.history.replace({pathname: "/new-sort", state: {transition: "fromSchedule"}})}>{this.props.start.title}</Button>
        if (this.props.history.location.pathname === "/new-sort") {
            startCrumb = <Select
                type="OnPage"
                label={startSelectLabel}
                options={this.fromSaveToOptions(this.props.start.savedStartSettings)}
                value={this.props.start.title}
                disabled={Object.keys(this.props.start.savedStartSettings).length === 0}
                clicked={(event) => this.props.onApplySelectedStartSettingsOption(event.target.value)}
            />
        }

        let scheduleSelectLabel = "Go To Schedule";
        if (this.props.schedule.loading) scheduleSelectLabel = "LOADING...";
        if (this.props.history.location.pathname === '/new-sort/schedule') scheduleSelectLabel = "Load Schedule";
        if (this.props.schedule.title.trim() !== "") scheduleSelectLabel = this.props.schedule.title;

        let scheduleCrumb = <Select
            type={this.props.history.location.pathname === "/new-sort/schedule" ? "OnPage" : null}
            label={scheduleSelectLabel}
            options={this.fromSaveToOptions(this.props.schedule.savedSchedules)}
            value={this.props.schedule.title}
            disabled={Object.keys(this.props.start.savedStartSettings).length === 0}
            clicked={(event) => this.scheduleSelectHandler(event.target.value)}
            />
        if (this.props.history.location.pathname === "/new-sort/students") {
            scheduleCrumb = <Button clicked={() => this.props.history.replace({pathname: "/new-sort/schedule", state: {transition: "fromStudents"}})}>{this.props.schedule.title}</Button>
        }

        let studentsSelectLabel = "Go To Student List";
        if (this.props.students.loading) studentsSelectLabel = "LOADING...";
        if (this.props.history.location.pathname === "/new-sort/students") studentsSelectLabel = "Load Student List";
        if (this.props.students.title.trim() !== "") studentsSelectLabel = this.props.students.title;

        let studentsCrumb = <Select
            type={this.props.history.location.pathname === "/new-sort/students" ? "OnPage" : null}
            label={studentsSelectLabel}
            options={this.fromSaveToOptions(this.props.students.savedStudentLists)}
            value={this.props.students.title}
            disabled={Object.keys(this.props.students.savedStudentLists).length === 0}
            clicked={(event) => this.studentSelectHandler(event.target.value)}
        />

        return (
            <div className="Breadcrumbs">

                <div className="Crumbs">
                    {startCrumb}
                    <h3>{'>'}</h3>
                    {scheduleCrumb}
                    <h3>{'>'}</h3>
                    {studentsCrumb}
                </div>

                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        start: state.start,
        schedule: state.schedule,
        students: state.students,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onApplySelectedStartSettingsOption: (selectedStartSettings) => dispatch(actions.applySelectedStartSettingsOption(selectedStartSettings)),

        onApplySelectedScheduleOption: (selectedSchedule) => dispatch(actions.applySelectedScheduleOption(selectedSchedule)),
        onIntegrateScheduleOption: (selectedSchedule, timeSlots) => dispatch(actions.integrateScheduleOption(selectedSchedule, timeSlots)),

        onApplySelectedStudentListOption: (selectedStudentList) => dispatch(actions.applySelectedStudentListOption(selectedStudentList)),
        onIntegrateStudentListOption: (selectedStudentList, choices, options ) => dispatch(actions.integrateStudentListOption(selectedStudentList, choices, options)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
