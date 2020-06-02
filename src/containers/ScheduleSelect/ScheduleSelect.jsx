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
        localError: null
    }

    componentDidMount () {
        this.props.onToggleScheduleContinue(false);
        this.props.onInitLoadSavedSchedules(this.props.auth.token, this.props.auth.localId);
    }

    componentDidUpdate () {
        if (this.props.schedule.schedule.length === 0) this.props.onAddNewRow(this.props.start.timeSlots);

        if (this.props.schedule.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/new-sort/students");
            }, 1000);
        }
    }

    continueModalHandler = () => {
        if (this.checkScheduleIsValid()) {
            this.setState({localError: null, showModal: true});
        } else {
            this.setState({localError: "Every activity needs a title, minimum number, and at least one selected time slot."});
        }
    }

    checkScheduleIsValid = () => {
        let titlesValid = true;
        let timeSlotsValid = true;
        //Check each activity has a title after .trim() and a minimum number value greater than 0
        for (let activity of this.props.schedule.schedule) {
            if (activity.label.trim() === "" || activity.minimum <= 0) {
                titlesValid = false;
                activity.valid = false;
            }
            //Check that each activity has at least one time slot checked
            if (!Object.values(activity.timeSlots).includes(true)) {
                timeSlotsValid = false;
                activity.valid = false;
            }
        }
        return titlesValid && timeSlotsValid;
    }

    saveScheduleHandler = () => {
        const saved = getMostRecentSaveOf(this.props.schedule.savedSchedules, this.props.schedule.title);

        const currentData = {
            activities: this.props.schedule.schedule,
            matchingStartSettings: this.props.start.title,
            title: this.props.schedule.title,
            userId: this.props.auth.localId,
        };

        //Check if current data is same as saved data and only save if different
        if (JSON.stringify(saved) === JSON.stringify(currentData)) {
            this.props.onToggleScheduleContinue(true);
        } else {
            this.props.onInitSaveSchedule(currentData, this.props.auth.token);
        }
    }

    render () {
        let modalContent = <React.Fragment>
            <div>
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
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >Cancel
            </Button>
        </React.Fragment>

        if (this.props.schedule.loading) modalContent = <Spinner />
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
        }

        return (
            <div className="ScheduleSelect">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <div className="TitleArea">
                    <h2>Schedule Editor</h2>
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
        auth: state.auth,
        start: state.start,
        schedule: state.schedule,
        students: state.students,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),
        onApplySelectedScheduleOption: (selectedSchedule) => dispatch(actions.applySelectedScheduleOption(selectedSchedule)),

        onApplySelectedStartSettingsOption: (selectedStartSettings) => dispatch(actions.applySelectedStartSettingsOption(selectedStartSettings)),
        onToggleScheduleContinue: (desiredSetting) => dispatch(actions.toggleScheduleContinue(desiredSetting)),

        onAddNewRow: (timeSlots) => dispatch(actions.addNewRow(timeSlots)),
        onDeleteRow: (rowId) => dispatch(actions.deleteRow(rowId)),

        onEditScheduleTitle: (edit) => dispatch(actions.editScheduleTitle(edit)),
        onUpdateScheduleData: (activityIndex, dataType, data) => dispatch(actions.updateScheduleData(activityIndex, dataType, data)),

        onInitSaveSchedule: (data, authToken) => dispatch(actions.saveScheduleInit(data, authToken)),
        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSelect);
