import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../utils/sharedFunctions';

import './ScheduleSelect.css';
import Schedule from '../../components/Schedule/Schedule';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';

class ScheduleSelect extends Component {
    state = {
        showModal: false,
        localError: null,
    }

    componentDidMount () {
        this.props.onToggleScheduleContinue(false);
    }

    componentDidUpdate () {
        if (this.props.schedule.schedule.length === 0) this.props.onAddNewRow(this.props.start.timeSlots);

        if (this.props.schedule.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/new-sort/students");
            }, 1000);
        }
    }

    checkScheduleIsValid = () => {
        let titlesValid = true;
        let timeSlotsValid = true;
        for (let i = 0; i < this.props.schedule.schedule.length; i++) { //Check label and minimum
            if (this.props.schedule.schedule[i].label.trim() === "" || this.props.schedule.schedule[i].minimum <= 0) {
                this.props.onUpdateScheduleData(i, "valid", false);
                titlesValid = false;
            }
            const temp = this.props.schedule.schedule[i].label; //Store current label as temp variable
            for (let j = i+1; j < this.props.schedule.schedule.length; j++) { //Look through rest of array forwards
                if (this.props.schedule.schedule[j].label === temp) { //Check for duplicate labels
                    this.props.onUpdateScheduleData(i, "valid", false);
                    this.props.onUpdateScheduleData(j, "valid", false);
                    timeSlotsValid = false;
                }
            }
            if (!Object.values(this.props.schedule.schedule[i].timeSlots).includes(true)) { //Check time slots
                this.props.onUpdateScheduleData(i, "valid", false);
                timeSlotsValid = false;
            }
        }
        return titlesValid && timeSlotsValid;
    }


    continueModalHandler = () => {
        if (this.checkScheduleIsValid()) {
            this.setState({localError: null, showModal: true});
            for (let i = 0; i < this.props.schedule.schedule.length; i++) { //In case duplicate time slots fixed
                this.props.onUpdateScheduleData(i, "valid", true); //Set all time slots to "valid" after checking
            }
        } else {
            this.setState({localError: "Every activity needs a unique title, minimum number, and at least one selected time slot."});
        }
    }

    saveScheduleHandler = () => {
        const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, this.props.schedule.title);
        // !!!WARNING: The following order MATTERS - make sure keys are listed alphabetically
        const currentData = {
            activities: this.props.schedule.schedule,
            matchingStartSettings: this.props.start.title,
            title: this.props.schedule.title,
            userId: this.props.auth.localId,
        };
        if (JSON.stringify(saved) === JSON.stringify(currentData)) { //Check if current data is same as saved data
            this.props.onToggleScheduleContinue(true);
        } else { //Only save to database if they are different
            this.props.onInitSaveSchedule(currentData, this.props.auth.token);
        }
    }

    render () {
        let modalErrorMessage = null;
        if (this.props.schedule.networkError) modalErrorMessage = <p><span style={{color: "red"}}>{this.props.schedule.networkError}</span></p>

        let modalContent = <React.Fragment>
            <div>
                {modalErrorMessage}
                <h3>Save This Schedule And Continue?</h3>
                <input
                    type="text"
                    value={this.props.schedule.title ? this.props.schedule.title : ""}
                    placeholder="Schedule Title"
                    maxLength="20"
                    onChange={(event) => {this.props.onEditScheduleTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.schedule.title.trim() === ""}
                clicked={this.saveScheduleHandler}
                >CONTINUE
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >CANCEL
            </Button>
        </React.Fragment>
        if (this.props.schedule.saveAndContinue) modalContent = <h3 style={{color: "green"}}>SCHEDULE SAVED!</h3>

        let errorMessage = null;
        if (this.props.schedule.networkError) errorMessage = <p style={{color: "red"}}>{this.props.schedule.networkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let schedule = <Schedule
            schedule={this.props.schedule.schedule}
            timeSlots={this.props.start.timeSlots}
            add={(timeSlots) => this.props.onAddNewRow(timeSlots)}
            update={(activityIndex, dataType, data) => this.props.onUpdateScheduleData(activityIndex, dataType, data)}
            delete={(rowId) => this.props.onDeleteRow(rowId)}
        />

        if (this.props.schedule.loading) {
            schedule = <Spinner />;
            modalContent = <Spinner />;
        }

        return (
            <div className="ScheduleSelect">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <div className="TitleArea">
                    <h2>Schedule Editor</h2>
                    <Button type="Success" clicked={this.continueModalHandler}>CONTINUE</Button>
                </div>

                {errorMessage}

                <div className="TableArea">
                    {schedule}
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
        onApplySelectedScheduleOption: (selectedSchedule) => dispatch(actions.applySelectedScheduleOption(selectedSchedule)),
        onApplySelectedStartSettingsOption: (selectedStartSettings) => dispatch(actions.applySelectedStartSettingsOption(selectedStartSettings)),

        onAddNewRow: (timeSlots) => dispatch(actions.addNewRow(timeSlots)),
        onDeleteRow: (rowId) => dispatch(actions.deleteRow(rowId)),
        onUpdateScheduleData: (activityIndex, dataType, data) => dispatch(actions.updateScheduleData(activityIndex, dataType, data)),

        onEditScheduleTitle: (edit) => dispatch(actions.editScheduleTitle(edit)),

        onToggleScheduleContinue: (desiredSetting) => dispatch(actions.toggleScheduleContinue(desiredSetting)),
        onInitSaveSchedule: (data, authToken) => dispatch(actions.saveScheduleInit(data, authToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSelect);
