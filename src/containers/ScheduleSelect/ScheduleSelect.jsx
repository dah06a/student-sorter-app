import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';

import './ScheduleSelect.css';
import Schedule from '../../components/Schedule/Schedule';
import Button from '../../components/UI/Button/Button';
import Select from '../../components/UI/Select/Select';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';

class ScheduleSelect extends Component {
    state = {
        showModal: false,
        localError: null
    }

    //Upon mounting, add a row and fetch schedule load data for specific user.
    componentDidMount () {
        this.props.onInitLoadSavedSchedules(this.props.token, this.props.localId);
        this.props.onAddNewRow();
    }

    componentDidUpdate () {
        if (this.props.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/students");
            }, 1000);
        }
    }

    closeModalHandler = () => {
        this.setState({showModal: false});
    }

    goBackHandler = () => {
        this.props.onResetScheduleData();
        this.props.history.replace("/start")
    }

    continueModalHandler = () => {
        if (this.checkScheduleIsValid(this.props.schedule)) {
            this.setState({localError: null, showModal: true});
        } else {
            this.setState({localError: "Every activity needs a title, minimum number, and at least one selected day."});
        }
    }

    checkScheduleIsValid = (currentSchedule) => {
        let titlesValid = true;
        let daysValid = true;
        const isFalse = (elem) => elem === false;
        //Check each activity has a title after .trim() and a minimum number value greater than 0
        for (let activity of currentSchedule) {
            if (activity.label.trim() === "" || activity.minimum <= 0) {
                titlesValid = false;
                activity.valid = false;
            }
            //Check that each activity has at least one day of the week checked
            const eachDayOfActivity = Object.values(activity.days);
            if (eachDayOfActivity.every(day => isFalse(day))) {
                daysValid = false;
                activity.valid = false;
            }
        }
        return titlesValid && daysValid;
    }

    render () {
        //Set load options after filtering schedules with duplicate titles
        let loadOptions = ["No Schedules Found"];
        if (this.props.savedSchedules) {
            const allOptions = Object.values(this.props.savedSchedules).map(schedule => schedule.title);
            loadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        //Check that a schedule is not saved under same name
        let modalError = null;
        for (let schedule in this.props.savedSchedules) {
            if (schedule === this.props.scheduleTitle) {
                modalError = <p style={{color: "red"}}><strong>Cannot have the same name as another schedule.</strong></p>
            }
        }

        let modalContent = <React.Fragment>
            <div>
                <h3>Save This Schedule And Continue?</h3>
                <input
                    type="text"
                    value={this.props.scheduleTitle ? this.props.scheduleTitle : ""}
                    placeholder="Schedule Title"
                    maxLength="20"
                    onChange={(event) => {this.props.onEditScheduleTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.scheduleTitle.trim() === "" || modalError}
                clicked={() => this.props.onInitSaveSchedule(this.props.scheduleTitle, this.props.schedule, this.props.token, this.props.localId)}
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={this.closeModalHandler}
                >Cancel
            </Button>
            {modalError}
        </React.Fragment>

        if (this.props.loading) modalContent = <Spinner />
        if (this.props.saveAndContinue) modalContent = <h3 style={{color: "green"}}>SCHEDULE SAVED!</h3>

        let errorMessage = null;
        if (this.props.networkError) errorMessage = <p style={{color: "red"}}>{this.props.networkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let schedule = <Schedule
            schedule={this.props.schedule}
            update={(activityIndex, dataType, data) => this.props.onUpdateScheduleData(activityIndex, dataType, data)}
            delete={(rowId) => this.props.onDeleteRow(rowId)}
        />
        if (this.props.loading) schedule = <Spinner />

        let scheduleSelectLabel = "Load Schedule";
        if (this.props.loading) scheduleSelectLabel = "Loading...";

        return (
            <div className="ScheduleSelect">
                <Modal show={this.state.showModal} toggle={this.closeModalHandler}>
                    {modalContent}
                </Modal>
                <h2>Schedule Editor</h2>

                <div className="ButtonArea">
                    <Button type="Danger" clicked={this.goBackHandler}>Go Back</Button>
                    <Button clicked={this.props.onAddNewRow}>Add Activity</Button>
                    <Select
                        label={scheduleSelectLabel}
                        options={loadOptions}
                        value={this.props.scheduleTitle}
                        clicked={(event) => this.props.onApplySelectedLoadOption(event.target.value)}
                    />
                    <Button type="Success" clicked={this.continueModalHandler}>Continue</Button>
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
        token: state.auth.token,
        localId: state.auth.localId,

        schedule: state.schedule.schedule,
        scheduleTitle: state.schedule.scheduleTitle,
        saveAndContinue: state.schedule.saveAndContinue,

        loading: state.schedule.loading,
        networkError: state.schedule.networkError,

        scheduleOption: state.start.scheduleOption,
        savedSchedules: state.schedule.savedSchedules,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),
        onApplySelectedLoadOption: (selectedSchedule) => dispatch(actions.applySelectedLoadOption(selectedSchedule)),

        onAddNewRow: () => dispatch(actions.addNewRow()),
        onDeleteRow: (rowId) => dispatch(actions.deleteRow(rowId)),

        onEditScheduleTitle: (edit) => dispatch(actions.editScheduleTitle(edit)),
        onUpdateScheduleData: (activityIndex, dataType, data) => dispatch(actions.updateScheduleData(activityIndex, dataType, data)),


        onInitSaveSchedule: (scheduleTitle, data, authToken, localId) => dispatch(actions.saveScheduleInit(scheduleTitle, data, authToken, localId)),
        onResetScheduleData: () => dispatch(actions.resetScheduleData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSelect);
