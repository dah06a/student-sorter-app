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
//import Spinner from '../../components/UI/Spinner/Spinner';

class Start extends Component {
    state = {
        showModal: false,
    }

    componentDidMount () {
        this.props.onInitLoadSavedSchedules(this.props.token, this.props.localId);
    }

    goToScheduleHandler = (selectedSchedule) => {
        console.log("Go to Schedule:");
    }

    render () {
        let modalContent = null;
        //Fill in modal here

        let scheduleSelectLabel = "Go To Schedule";
        if (this.props.scheduleLoading) scheduleSelectLabel = "Loading...";

        let scheduleLoadOptions = ["No Schedules Found"];
        if (this.props.savedSchedules) {
            const allOptions = Object.values(this.props.savedSchedules).map(schedule => schedule.title);
            scheduleLoadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        let studentsSelectLabel = "Go To Student List";
        if (this.props.studentsLoading) studentsSelectLabel = "Loading...";

        let studentLoadOptions = ["No Student Lists Found"];
        if (this.props.savedStudentLists) {
            const allOptions = Object.values(this.props.savedStudentLists).map(studentList => studentList.title);
            studentLoadOptions = allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);
        }

        let timeSlotTable = <TimeSlotTable
            timeSlots={this.props.timeSlots}
            update={console.log("update")}
            delete={(rowId) => this.props.onDeleteRow(rowId)}
        />

        return (
            <div className="Start">
                <Modal show={this.state.showModal} toggle={this.closeModalHandler}>
                    {modalContent}
                </Modal>
                <h2>Sort Settings</h2>

                <div className="ButtonArea">
                    <Button type="Danger">Clear Settings</Button>
                    <Select
                        label={scheduleSelectLabel}
                        options={scheduleLoadOptions}
                        value={this.props.scheduleTitle}
                        disabled={!this.props.savedSchedules}
                        clicked={(event) => this.goToScheduleHandler(event.target.value)}
                    />
                    <Select
                        label={studentsSelectLabel}
                        options={studentLoadOptions}
                        value={this.props.scheduleTitle}
                        disabled={!this.props.savedStudentLists}
                        clicked={(event) => this.props.onApplySelectedLoadOption(event.target.value)}
                    />
                    <Button type="Success" clicked={this.continueModalHandler}>Continue</Button>
                </div>

                <div className="TimeSlotArea">
                    {timeSlotTable}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        localId: state.auth.localId,

        savedSchedules: state.schedule.savedSchedules,
        savedStudentLists: state.students.savedStudentLists,
        savedStartSettings: state.start.savedStartSettings,

        timeSlots: state.start.timeSlots,

        choiceOption: state.start.choiceOption,
        choiceDuplicatesAllowed: state.start.choiceDuplicatesAllowed,

        sortOption: state.start.sortOption,

        startSettingsLoading: state.start.loading,
        scheduleLoading: state.schedule.loading,
        studentsLoading: state.students.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),
        onInitLoadSavedStudentLists: (token, localId) => dispatch(actions.initLoadSavedStudentLists(token, localId)),

        onSetChoiceOption: (value) => dispatch(actions.setChoiceOption(value)),
        onSetChoiceDuplicates: () => dispatch(actions.setChoiceDuplicates()),

        onSetSortOption: (value) => dispatch(actions.setSortOption(value)),

        onSetScheduleData: (schedule, scheduleTitle, saveAndContinue) => dispatch(actions.setScheduleData(schedule, scheduleTitle, saveAndContinue)),

        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
        onResetStudentData: () => dispatch(actions.resetStudentData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
