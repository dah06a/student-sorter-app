import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';

import './Start.css';
import TimeSlotTable from '../../components/TimeSlotTable/TimeSlotTable';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Select from '../../components/UI/Select/Select';
import Slider from '../../components/UI/Slider/Slider';
import ToggleSwitch from '../../components/UI/ToggleSwitch/ToggleSwitch';
import Spinner from '../../components/UI/Spinner/Spinner';

class Start extends Component {
    state = {
        showModal: false,
        localError: null
    }

    componentDidMount () {
        //Reset all store data if component mounted after "New Sort" NavLink was used from toolbar nav menu
        if (this.props.location.state !== undefined) {
            if (this.props.location.state.fromNav) {
                this.props.onResetStartSettingsData();
                this.props.onResetScheduleData();
                this.props.onResetStudentData();
                this.props.onAddNewTimeSlot();
            }
        }

        this.props.onInitLoadSavedStartSettings(this.props.token, this.props.localId);
        this.props.onInitLoadSavedSchedules(this.props.token, this.props.localId);
        if (this.props.timeSlots.length === 0) this.props.onAddNewTimeSlot();
    }

    componentDidUpdate () {
       if (this.props.startSaveAndContinue) {
        setTimeout(() => {
            this.props.history.replace("/schedule");
        }, 1000);
       }
    }

    goToScheduleHandler = (selectedSchedule) => {

        // !!! NEED TO COMPLETE

        console.log("Go to Schedule:");

        // !!! NEED TO COMPLETE

    }

    goToStudentHandler = (selectedStudentList) => {
        console.log("Go to Student List")
    }

    checkSettingsAreValid = () => {
        let allTimeSlotsValid = true;
        for (let i = 0; i < this.props.timeSlots.length; i++) { //Loop through each timeSlot
            if (this.props.timeSlots[i].label.trim() === "") { //If label is blank, set validations to false
                this.props.timeSlots[i].valid = false;
                allTimeSlotsValid = false;
            }
            const temp = this.props.timeSlots[i].label; //Store current label as temp value
            for (let j = i+1; j < this.props.timeSlots.length; j++) { //Loop through the rest of the array
                if (this.props.timeSlots[j].label === temp) { //If duplicates exist, set validations to false
                    this.props.timeSlots[i].valid = false;
                    this.props.timeSlots[j].valid = false;
                    allTimeSlotsValid = false;
                }
            }
        }
        return allTimeSlotsValid;
    }

    continueModalHandler = () => {
        if (this.checkSettingsAreValid()) {
            this.setState({localError: null, showModal: true});
            this.props.timeSlots.forEach(timeSlot => timeSlot.valid = true); //In case duplicate time slots fixed
        } else {
            this.setState({localError: "Each time slot must have a different label"});
        }
    }

    saveStartSettingsHandler = () => {
        const data = {
            userId: this.props.localId,
            title: this.props.startSettingsTitle,
            timeSlots: this.props.timeSlots,
            studentChoices: this.props.studentChoices,
            choiceDuplicatesAllowed: this.props.choiceDuplicatesAllowed
        };
        this.props.onSaveStartSettingsInit(data, this.props.token);
    }

    render () {
        let modalErrorMessage = null;
        if (this.props.startNetworkError) modalErrorMessage = <p><span style={{color: "red"}}>{this.props.startNetworkError}</span></p>

        let modalContent = <React.Fragment>
            <div>
                {modalErrorMessage}
                <h3>Save Settings And Continue To Schedule Editor?</h3>
                <input
                    type="text"
                    value={this.props.startSettingsTitle ? this.props.startSettingsTitle : ""}
                    placeholder="Start Settings Title"
                    maxLength="255"
                    onChange={(event) => {this.props.onEditStartSettingsTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.startSettingsTitle.trim() === ""}
                clicked={this.saveStartSettingsHandler}
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >Cancel
            </Button>
        </React.Fragment>
        if (this.props.startSettingsLoading) modalContent = <Spinner />
        if (this.props.startSaveAndContinue) modalContent = <h3 style={{color: "green"}}>SETTINGS SAVED!</h3>

        let startSettingsSelectLabel = "Load Settings";
        if (this.props.startSettingsLoading) startSettingsSelectLabel = "Loading...";
        let startSettingsLoadOptions = ["No Start Settings Found"];
        if (Object.keys(this.props.savedStartSettings).length !== 0) {
            const allOptions = Object.values(this.props.savedStartSettings).map(startSettings => startSettings.title);
            startSettingsLoadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        let scheduleSelectLabel = "Go To Schedule";
        if (this.props.scheduleLoading) scheduleSelectLabel = "Loading...";
        let scheduleLoadOptions = ["No Schedules Found"];
        if (Object.keys(this.props.savedSchedules).length !== 0) {
            const allOptions = Object.values(this.props.savedSchedules).map(schedule => schedule.title);
            scheduleLoadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        let studentsSelectLabel = "Go To Student List";
        if (this.props.studentsLoading) studentsSelectLabel = "Loading...";
        let studentLoadOptions = ["No Student Lists Found"];
        if (Object.keys(this.props.savedStudentLists).length !== 0) {
            const allOptions = Object.values(this.props.savedStudentLists).map(studentList => studentList.title);
            studentLoadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        let errorMessage = null;
        if (this.props.scheduleNetworkError) errorMessage = <p style={{color: "red"}}>{this.props.scheduleNetworkError}</p>
        if (this.props.studentsNetworkError) errorMessage = <p style={{color: "red"}}>{this.props.studentsNetworkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let timeSlotTable = <TimeSlotTable
            timeSlots={this.props.timeSlots}
            add={() => this.props.onAddNewTimeSlot()}
            delete={(id) => this.props.onDeleteTimeSlot(id)}
            update={(timeSlotIndex, data) => this.props.onUpdateTimeSlotData(timeSlotIndex, data)}
        />

        let duplicateMessage = <p><span style={{color: "red"}}>OFF</span> Students CANNOT select duplicate choices</p>
        if (this.props.choiceDuplicatesAllowed) duplicateMessage = <p><span style={{color: "green"}}>ON</span> Students CAN select duplicate choices</p>

        let choiceOptions = <React.Fragment>
            <div className="Choices">
                <h3>Set Student Choices</h3>
                <Slider
                    style={{width: "200px"}}
                    min="0"
                    max="20"
                    value={this.props.studentChoices}
                    change={(value) => this.props.onEditStudentChoices(value)}>
                    <strong>{this.props.studentChoices} choices per student</strong>
                </Slider>
            </div>
            <div className="DividingLine" />
            <div className="Duplicates">
                <h3>Allow Choice Duplicates?</h3>
                <ToggleSwitch check={this.props.choiceDuplicatesAllowed} change={() => this.props.onSetChoiceDuplicates()} />
                <strong>{duplicateMessage}</strong>
            </div>
        </React.Fragment>

        if (this.props.startSettingsLoading) {
            timeSlotTable = <Spinner />;
            choiceOptions = <Spinner />;
        }

        return (
            <div className="Start">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>
                <h2>Sort Settings</h2>

                <div className="ButtonArea">
                    <Select
                        label={startSettingsSelectLabel}
                        options={startSettingsLoadOptions}
                        value={this.props.startSettingsTitle}
                        disabled={Object.keys(this.props.savedStartSettings).length === 0}
                        clicked={(event) => this.props.onApplySelectedStartSettingsOption(event.target.value)}
                    />
                    <Select
                        label={scheduleSelectLabel}
                        options={scheduleLoadOptions}
                        value={this.props.scheduleTitle}
                        disabled={Object.keys(this.props.savedSchedules).length === 0}
                        clicked={(event) => this.goToScheduleHandler(event.target.value)}
                    />
                    <Select
                        label={studentsSelectLabel}
                        options={studentLoadOptions}
                        value={this.props.scheduleTitle}
                        disabled={Object.keys(this.props.savedStudentLists).length === 0}
                        clicked={(event) => this.props.onApplySelectedLoadOption(event.target.value)}
                    />
                    <Button type="Success" clicked={this.continueModalHandler}>Continue</Button>
                </div>

                {errorMessage}

                <div className="SettingsArea">

                    <div className="TimeSlotSettings">
                        {timeSlotTable}
                    </div>

                    <div className="ChoiceSettings">
                        {choiceOptions}
                    </div>

                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        localId: state.auth.localId,

        timeSlots: state.start.timeSlots,
        studentChoices: state.start.studentChoices,
        choiceDuplicatesAllowed: state.start.choiceDuplicatesAllowed,
        startSettingsTitle: state.start.startSettingsTitle,

        savedStartSettings: state.start.savedStartSettings,
        savedSchedules: state.schedule.savedSchedules,
        savedStudentLists: state.students.savedStudentLists,

        startSettingsLoading: state.start.loading,
        scheduleLoading: state.schedule.loading,
        studentsLoading: state.students.loading,

        startNetworkError: state.start.networkError,
        scheduleNetworkError: state.schedule.networkError,
        studentsNetworkError: state.students.networkError,

        startSaveAndContinue: state.start.saveAndContinue,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitLoadSavedStartSettings: (token, localId) => dispatch(actions.initLoadSavedStartSettings(token, localId)),
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),
        //onInitLoadSavedStudentLists: (token, localId) => dispatch(actions.initLoadSavedStudentLists(token, localId)),

        onApplySelectedStartSettingsOption: (selectedStartSettings) => dispatch(actions.applySelectedStartSettingsOption(selectedStartSettings)),

        onAddNewTimeSlot: () => dispatch(actions.addNewTimeSlot()),
        onDeleteTimeSlot: (id) => dispatch(actions.deleteTimeSlot(id)),
        onUpdateTimeSlotData: (timeSlotIndex, data) => dispatch(actions.updateTimeSlotData(timeSlotIndex, data)),

        onEditStudentChoices: (value) => dispatch(actions.editStudentChoices(value)),
        onSetChoiceDuplicates: () => dispatch(actions.setChoiceDuplicates()),
        onEditStartSettingsTitle: (data) => dispatch(actions.editStartSettingsTitle(data)),

        onSaveStartSettingsInit: (data, authToken) => dispatch(actions.saveStartSettingsInit(data, authToken)),

        onResetStartSettingsData: () => dispatch(actions.resetStartSettingsData()),
        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
        onResetStudentData: () => dispatch(actions.resetStudentData()),

        //Need to review these action dispatches
        onSetScheduleData: (schedule, scheduleTitle, saveAndContinue) => dispatch(actions.setScheduleData(schedule, scheduleTitle, saveAndContinue)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
