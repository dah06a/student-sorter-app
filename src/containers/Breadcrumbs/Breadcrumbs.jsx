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
        showWarning: false,
        selection: null,
    }

    componentDidMount () {

    }

    fromSaveToOptions = (saveObject) => {
        if (Object.keys(saveObject).length === 0) {
            return ["No Start Settings Found"];
        } else {
            const allOptions = Object.values(saveObject).map(value => value.title);
            return allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }
    }

    setScheduleWithOriginalHandler = (value) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, value);
        this.props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        this.props.onApplySelectedScheduleOption(value);
        this.props.history.replace("/new-sort/schedule");
    }

    setScheduleWithNewHandler = () => {
        this.setState({showModal: false});
        this.props.onIntegrateScheduleOption(this.state.selection, this.props.start.timeSlots);
    }

    setStudentsWithOriginalHandler = (value) => {
        this.setState({showModal: false});
        const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, value);
        this.props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        this.props.onApplySelectedScheduleOption(saved.matchingSchedule);
        this.props.onApplySelectedStudentListOption(value);
        this.props.history.replace("/new-sort/students");
    }

    setStudentsWithNewHandler = () => {
        this.setState({showModal: false});
        const currentOptions = this.props.schedule.schedule.map(option => option.label);
        this.props.onIntegrateStudentListOption(this.state.selection, this.props.start.studentChoices, currentOptions);
    }

    render () {
        let modalTitle = <h3>Choose Original Or New Start Settings?</h3>
        let modalMessage = <p>You may either load this schedule with its matching start settings, or use it with the new settings you have created.</p>
        let warningMessage = <p><span style={{color: "red"}}>If you choose to "USE NEW" and overwrite your save with the same name, your original settings will be replaced.</span></p>

        if (this.props.history.location.pathname === "/new-sort/students") {
            modalTitle = <h3>Choose Original Or New Settings And Schedule?</h3>
            modalMessage = <p>You may either load this student list with its matching settings and schedule, or use it with the new settings and schedule you have created.</p>
        }

        let modalContent = <React.Fragment>
            <div>
                {modalTitle}
                {modalMessage}
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
                >USE ORIGINAL
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >CANCEL
            </Button>
            {this.state.showWarning ? warningMessage : null}
        </React.Fragment>

        let startSelectLabel = "Load Start Settings";
        if (this.props.start.loading) startSelectLabel = "LOADING...";
        if (this.props.start.title.trim() !== "") startSelectLabel = this.props.start.title;

        let startCrumb = <Button clicked={() => this.props.history.replace("/new-sort")}>{this.props.start.title}</Button>
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

        let scheduleSelectLabel = "Load Schedule";
        if (this.props.schedule.loading) scheduleSelectLabel = "LOADING...";
        if (this.props.schedule.title.trim() !== "") scheduleSelectLabel = this.props.schedule.title;

        let scheduleCrumb = <Select
            type={this.props.history.location.pathname === "/new-sort/schedule" ? "OnPage" : null}
            label={scheduleSelectLabel}
            options={this.fromSaveToOptions(this.props.schedule.savedSchedules)}
            value={this.props.schedule.title}
            disabled={Object.keys(this.props.start.savedStartSettings).length === 0}
            clicked={(event) => {
                if (this.props.history.location.pathname === "/new-sort/schedule") this.setState({showModal: true, selection: event.target.value});
                else this.setScheduleWithOriginalHandler(event.target.value)
                }}
            />
        if (this.props.history.location.pathname === "/new-sort/students") {
            scheduleCrumb = <Button clicked={() => this.props.history.replace("/new-sort/schedule")}>{this.props.schedule.title}</Button>
        }

        let studentsSelectLabel = "Load Student List";
        if (this.props.students.loading) studentsSelectLabel = "LOADING...";
        if (this.props.students.title.trim() !== "") studentsSelectLabel = this.props.students.title;

        let studentsCrumb = <Select
            type={this.props.history.location.pathname === "/new-sort/students" ? "OnPage" : null}
            label={studentsSelectLabel}
            options={this.fromSaveToOptions(this.props.students.savedStudentLists)}
            value={this.props.students.title}
            disabled={Object.keys(this.props.students.savedStudentLists).length === 0}
            clicked={(event) => {
                if (this.props.history.location.pathname === "/new-sort/students") this.setState({showModal: true, selection: event.target.value});
                else this.setStudentsWithOriginalHandler(event.target.value)
            }}
        />

        return (
            <div className="Breadcrumbs">

                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <div className="Crumbs">
                    {startCrumb}
                    <h3>></h3>
                    {scheduleCrumb}
                    <h3>></h3>
                    {studentsCrumb}
                </div>

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
