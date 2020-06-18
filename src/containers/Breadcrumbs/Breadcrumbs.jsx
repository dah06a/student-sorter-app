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
    //Open warning modal if user is building time slots, otherwise, load selected start settings
    startSelectHandler = (selectedStartSettings) => {
        if (this.props.start.timeSlots.length > 1) {
            this.setState({showModal: true, modalType: "start", selection: selectedStartSettings});
        } else {
            this.props.onApplySelectedStartSettingsOption(selectedStartSettings);
        }
    }
    //Close modal and load selected start settings after clicking "CONTINUE" in warning modal
    setStartSettingsHandler = (selectedStartSettings) => {
        this.setState({showModal: false});
        this.props.onApplySelectedStartSettingsOption(selectedStartSettings);
    }
    //If selected schedule start settings are already being used, just load selected schedule, otherwise open choose modal
    scheduleSelectHandler = (selectedSchedule) => {
        if (this.props.history.location.pathname === "/new-sort/schedule") {
            const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, selectedSchedule);
            if (saved.matchingStartSettings === this.props.start.title) {
                this.props.onApplySelectedScheduleOption(selectedSchedule);
            } else {
                this.setState({showModal: true, modalType: "choose", selection: selectedSchedule});
            } //If user is working on time slots, show warning modal, otherwise, load and go to schedule
        } else if (this.props.start.timeSlots.length > 1) {
            this.setState({showModal: true, modalType: "schedule", selection: selectedSchedule});
        } else {
            this.setScheduleWithOriginalHandler(selectedSchedule);
        }
    }
    //If user selects to use matching data, load settings first, then the schedule and go to next page
    setScheduleWithOriginalHandler = (selectedSchedule) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, selectedSchedule);
        const matchingSettings = saved.matchingStartSettings.slice(0, saved.matchingStartSettings.length);
        this.props.onApplySelectedStartSettingsOption(matchingSettings);
        this.props.onApplySelectedScheduleOption(selectedSchedule);
        this.props.history.replace({pathname: "/new-sort/schedule", start: {transition: "fromStart"}});
    }
    //If user selects to use new data, integrate the selected schedule with the current start settings
    setScheduleWithNewHandler = () => {
        this.setState({showModal: false});
        this.props.onIntegrateScheduleOption(this.state.selection, this.props.start.timeSlots);
    }
    //If selected student settings and schedule are already being used, just load selected students, otherwise open choose modal
    studentSelectHandler = (selectedStudentList) => {
        if (this.props.history.location.pathname === "/new-sort/students") {
            const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, selectedStudentList);
            if (saved.matchingStartSettings === this.props.start.title && saved.matchingSchedule === this.props.schedule.title) {
                this.props.onApplySelectedStudentListOption(selectedStudentList);
            } else {
                this.setState({showModal: true, modalType: "choose", selection: selectedStudentList});
            } //If user is working on time slots or schedule, show warning modal, otherwise, load and go to students
        } else if (this.props.start.timeSlots.length > 1 || this.props.schedule.schedule.length > 1) {
            this.setState({showModal: true, modalType: "students", selection: selectedStudentList});
        } else {
            this.setStudentsWithOriginalHandler(selectedStudentList);
        }
    }
    //If user selects to use matching students, load matching settings and schedule first, then the students, and go to page
    setStudentsWithOriginalHandler = (selectedStudentList) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, selectedStudentList);
        this.props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        this.props.onApplySelectedScheduleOption(saved.matchingSchedule);
        this.props.onApplySelectedStudentListOption(selectedStudentList);
        this.props.history.replace({pathname: "/new-sort/students", state: {transition: "toStudents"}});
    }
    //If user selects to use new data, integrate the selected students with the current start settings and schedule
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
                <h3>Use With <span style={{textShadow: "2px 2px var(--Success)"}}>New</span> Or <span style={{textShadow: "2px 2px var(--Primary)"}}>Matching</span>?</h3>
                <p>Selected Work: <strong>{this.state.selection}</strong></p>

                <div className="SettingsDisplay">
                    <div className="Settings">
                        <h4 style={{color: "var(--Success)", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>New Data</h4>
                        <p>Settings: <strong>{this.props.start.title}</strong></p>
                        {this.props.history.location.pathname === "/new-sort/students" ? <p>Schedule: <strong>{this.props.schedule.title}</strong></p> : null}
                    </div>

                    <div className="Settings">
                    <h4 style={{color: "var(--Primary)", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>Matching Data</h4>
                        <p>Settings: <strong>{saved.matchingStartSettings}</strong></p>
                        {this.props.history.location.pathname === "/new-sort/students" ? <p>Schedule: <strong>{saved.matchingSchedule}</strong></p> : null}
                    </div>
                </div>

            </div>
            <Button
                type="Success"
                enter={() => this.setState({showWarning: true})}
                leave={() => this.setState({showWarning: false})}
                clicked={() => {
                    if (this.props.history.location.pathname === "/new-sort/schedule") this.setScheduleWithNewHandler();
                    if (this.props.history.location.pathname === "/new-sort/students") this.setStudentsWithNewHandler();
                }}
                >USE NEW
            </Button>
            <Button
                type="Info"
                clicked={() => {
                    if (this.props.history.location.pathname === "/new-sort/schedule") this.setScheduleWithOriginalHandler(this.state.selection);
                    if (this.props.history.location.pathname === "/new-sort/students") this.setStudentsWithOriginalHandler(this.state.selection);
                }}
                >USE MATCHING
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >CANCEL
            </Button>
            {this.state.showWarning ? <p><span style={{color: "red"}}>If you choose "USE NEW" and save over your work with the same title, your matching data will be replaced.</span></p> : null}
        </React.Fragment>

        if (this.state.modalType !== "choose") modalContent = <React.Fragment>
            <h3>Are You Sure You Want Load "{this.state.selection}"?</h3>
            <p>Without saving, the data on this page will be lost.</p>
            <Button
                type="Success"
                clicked={() => {
                    if (this.state.modalType === "start") this.setStartSettingsHandler(this.state.selection);
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
                clicked={(event) => this.startSelectHandler(event.target.value)}
            />
        }

        let scheduleSelectLabel = "Go To Schedule";
        if (this.props.schedule.loading) scheduleSelectLabel = "LOADING...";
        if (this.props.history.location.pathname === '/new-sort/schedule') scheduleSelectLabel = "Load Schedule";
        if (this.props.schedule.title.trim() !== "") scheduleSelectLabel = this.props.schedule.title;

        let scheduleCrumb = <Button clicked={() => this.props.history.replace({pathname: "/new-sort/schedule", state: {transition: "fromStudents"}})}>{this.props.schedule.title}</Button>
        if (this.props.history.location.pathname !== "/new-sort/students") {
            scheduleCrumb = <Select
                type={this.props.history.location.pathname === "/new-sort/schedule" ? "OnPage" : null}
                label={scheduleSelectLabel}
                options={this.fromSaveToOptions(this.props.schedule.savedSchedules)}
                value={this.props.schedule.title}
                disabled={Object.keys(this.props.start.savedStartSettings).length === 0}
                clicked={(event) => this.scheduleSelectHandler(event.target.value)}
            />
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
