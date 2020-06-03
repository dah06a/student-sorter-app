import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../utils/sharedFunctions';

import './Start.css';
import TimeSlotTable from '../../components/TimeSlotTable/TimeSlotTable';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
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
            }
        }
        this.props.onToggleStartSettingsContinue(false);
        this.props.onInitLoadSavedStartSettings(this.props.auth.token, this.props.auth.localId);
        this.props.onInitLoadSavedSchedules(this.props.auth.token, this.props.auth.localId);
        this.props.onInitLoadSavedStudentLists(this.props.auth.token, this.props.auth.localId);
    }

    componentDidUpdate () {
        if (this.props.start.timeSlots.length === 0) this.props.onAddNewTimeSlot();

        if (this.props.start.saveAndContinue) {
            setTimeout(() => this.props.history.replace("/new-sort/schedule"), 1000);
        }
    }

    checkSettingsAreValid = () => {
        let allTimeSlotsValid = true;
        for (let i = 0; i < this.props.start.timeSlots.length; i++) { //Loop through each timeSlot
            if (this.props.start.timeSlots[i].label.trim() === "") { //If label is blank, set validations to false
                this.props.onUpdateTimeSlotData(i, "valid", false)
                allTimeSlotsValid = false;
            }
            const temp = this.props.start.timeSlots[i].label; //Store current label as temp value
            for (let j = i+1; j < this.props.start.timeSlots.length; j++) { //Loop through the rest of the array
                if (this.props.start.timeSlots[j].label === temp) { //If duplicates exist, set validations to false
                    this.props.onUpdateTimeSlotData(i, "valid", false);
                    this.props.onUpdateTimeSlotData(j, "valid", false);
                    allTimeSlotsValid = false;
                }
            }
        }
        return allTimeSlotsValid;
    }

    continueModalHandler = () => {
        if (this.checkSettingsAreValid()) {
            this.setState({localError: null, showModal: true});
            for (let i = 0; i < this.props.start.timeSlots.length; i++) { //In case duplicate time slots fixed
                this.props.onUpdateTimeSlotData(i, "valid", true); //Set all time slots to "valid" after checking
            }
        } else {
            this.setState({localError: "Each time slot must have a different label."});
        }
    }

    saveStartSettingsHandler = () => {
        const saved = getMostRecentSaveOf(this.props.start.savedStartSettings, this.props.start.title);
        // !!!WARNING: The following order MATTERS - make sure keys are listed alphabetically
        const currentData = {
            choiceDuplicatesAllowed: this.props.start.choiceDuplicatesAllowed,
            studentChoices: this.props.start.studentChoices,
            timeSlots: this.props.start.timeSlots,
            title: this.props.start.title,
            userId: this.props.auth.localId,
        };
        if (JSON.stringify(saved) === JSON.stringify(currentData)) { //Check if current data is same as saved data
            this.props.onToggleStartSettingsContinue(true);
        } else { //Only save to database if they are different
            this.props.onSaveStartSettingsInit(currentData, this.props.auth.token);
        }
    }

    render () {
        let modalErrorMessage = null;
        if (this.props.start.networkError) modalErrorMessage = <p><span style={{color: "red"}}>{this.props.start.networkError}</span></p>

        let modalContent = <React.Fragment>
            <div>
                {modalErrorMessage}
                <h3>Save Settings And Continue To Schedule Editor?</h3>
                <input
                    type="text"
                    value={this.props.start.title ? this.props.start.title : ""}
                    placeholder="Start Settings Title"
                    maxLength="255"
                    onChange={(event) => {this.props.onEditStartSettingsTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.start.title.trim() === ""}
                clicked={this.saveStartSettingsHandler}
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >Cancel
            </Button>
        </React.Fragment>
        if (this.props.start.loading) modalContent = <Spinner />
        if (this.props.start.saveAndContinue) modalContent = <h3 style={{color: "green"}}>SETTINGS SAVED!</h3>

        let errorMessage = null;
        if (this.props.start.networkError) errorMessage = <p style={{color: "red"}}>{this.props.start.networkError}</p>
        if (this.props.schedule.networkError) errorMessage = <p style={{color: "red"}}>{this.props.schedule.networkError}</p>
        if (this.props.students.networkError) errorMessage = <p style={{color: "red"}}>{this.props.students.networkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let timeSlotTable = <TimeSlotTable
            timeSlots={this.props.start.timeSlots}
            add={() => this.props.onAddNewTimeSlot()}
            delete={(id) => this.props.onDeleteTimeSlot(id)}
            update={(timeSlotIndex, dataType, data) => this.props.onUpdateTimeSlotData(timeSlotIndex, dataType, data)}
        />

        let duplicateMessage = <p><span style={{color: "red"}}>OFF</span> Students CANNOT select duplicate choices</p>
        if (this.props.start.choiceDuplicatesAllowed) duplicateMessage = <p><span style={{color: "green"}}>ON</span> Students CAN select duplicate choices</p>

        let choiceOptions = <React.Fragment>
            <div className="Choices">
                <h3>Set Student Choices</h3>
                <Slider
                    style={{width: "200px"}}
                    color={this.props.start.studentChoices < 1 ? "Dark" : null}
                    min="0"
                    max="20"
                    value={this.props.start.studentChoices}
                    change={(value) => this.props.onEditStudentChoices(value)}>
                    <strong>{this.props.start.studentChoices} choices per student</strong>
                </Slider>
            </div>
            <div className="DividingLine" />
            <div className="Duplicates">
                <h3>Allow Choice Duplicates?</h3>
                <ToggleSwitch check={this.props.start.choiceDuplicatesAllowed} change={() => this.props.onSetChoiceDuplicates()} />
                <strong>{duplicateMessage}</strong>
            </div>
        </React.Fragment>

        if (this.props.start.loading) {
            timeSlotTable = <Spinner />;
            choiceOptions = <Spinner />;
        }

        return (
            <div className="Start">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>
                <div className="TitleArea">
                    <h2>Sort Settings</h2>
                    <Button type="Success" clicked={this.continueModalHandler}>CONTINUE</Button>
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
        auth: state.auth,
        start: state.start,
        schedule: state.schedule,
        students: state.students,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitLoadSavedStartSettings: (token, localId) => dispatch(actions.initLoadSavedStartSettings(token, localId)),
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),
        onInitLoadSavedStudentLists: (token, localId) => dispatch(actions.initLoadSavedStudentLists(token, localId)),

        onAddNewTimeSlot: () => dispatch(actions.addNewTimeSlot()),
        onDeleteTimeSlot: (id) => dispatch(actions.deleteTimeSlot(id)),
        onUpdateTimeSlotData: (timeSlotIndex, dataType, data) => dispatch(actions.updateTimeSlotData(timeSlotIndex, dataType, data)),

        onEditStudentChoices: (value) => dispatch(actions.editStudentChoices(value)),
        onSetChoiceDuplicates: () => dispatch(actions.setChoiceDuplicates()),
        onEditStartSettingsTitle: (data) => dispatch(actions.editStartSettingsTitle(data)),

        onToggleStartSettingsContinue: (desiredSetting) => dispatch(actions.toggleStartSettingsContinue(desiredSetting)),
        onSaveStartSettingsInit: (data, authToken) => dispatch(actions.saveStartSettingsInit(data, authToken)),

        onResetStartSettingsData: () => dispatch(actions.resetStartSettingsData()),
        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
        onResetStudentData: () => dispatch(actions.resetStudentData()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
