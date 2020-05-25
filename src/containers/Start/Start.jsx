import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';

import './Start.css';
import Button from '../../components/UI/Button/Button';
import Select from '../../components/UI/Select/Select';
import Slider from '../../components/UI/Slider/Slider';
import ToggleSwitch from '../../components/UI/ToggleSwitch/ToggleSwitch';
//import Spinner from '../../components/UI/Spinner/Spinner';

class Start extends Component {

    componentDidMount () {
        //Initialize saved schedules and student lists from firebase
        this.props.onInitLoadSavedSchedules(this.props.token, this.props.localId);
        this.props.onInitLoadSavedStudentLists(this.props.token, this.props.localId);

        //Reset old redux-store data for the current schedule and student list
        this.props.onResetScheduleData();
        this.props.onResetStudentData();
    }

    scheduleSelectHandler = (event) => {
        this.props.onSelectSchedule(event.target.value);
        if (this.props.choiceOption !== -1) this.props.onSetChoiceOption(0);
    }

    submitSettingsHandler = (event) => {
        event.preventDefault();
        if (this.props.scheduleOption === "use") {
            this.props.onSetScheduleData(this.props.savedSchedules[this.props.selectedSchedule].activities, this.props.selectedSchedule, true);
            this.props.history.push("/students");
        } else {
            this.props.history.push("/schedule");
        }
    }

    render () {
        const dividingLine = <div className="DividingLine" />

        let scheduleSelectLabel = "Select Schedule";
        if (this.props.loading) scheduleSelectLabel = "Loading...";
        if (!this.props.savedSchedules) scheduleSelectLabel = "No Schedules Found";

        let scheduleSelect = null;
        if (this.props.scheduleOption === "edit" || this.props.scheduleOption === "use") {
            scheduleSelect = <Select
                label={scheduleSelectLabel}
                options={this.props.savedSchedules ? Object.keys(this.props.savedSchedules) : null}
                value={this.props.selectedSchedule}
                clicked={(event) => this.scheduleSelectHandler(event)}
            />
        }

        let studentListSelectLabel = "Select Student List";
        if (this.props.loading) studentListSelectLabel = "Loading...";
        if (!this.props.savedStudentLists) studentListSelectLabel = "No Lists Found";

        let studentListSelect = null;
        if (this.props.studentOption === "edit") {
            studentListSelect = <Select
                label={studentListSelectLabel}
                options = {Object.keys(this.props.savedStudentLists)}
                value={this.props.selectedStudentList}
                clicked={(event) => this.props.onSelectStudentList(event.target.value)}
            />
        }

        let choiceLimit = 20;
        if (this.props.selectedSchedule) {
            choiceLimit = this.props.savedSchedules[this.props.selectedSchedule].activities.length;
        }

        let duplicates = <p><span style={{color: "var(--Danger)"}}><strong>OFF : </strong></span>Students CANNOT select duplicate activities</p>;
        if (this.props.choiceDuplicatesAllowed) duplicates = <p><span style={{color: "var(--Success)"}}><strong>ON : </strong></span>Students CAN select duplicate activities</p>;

        let sorting = "(please set)";
        if (this.props.sortOption === "0") sorting = <span style={{color: "yellow"}}><strong>Cursory</strong></span>;
        if (this.props.sortOption === "1") sorting = <span style={{color: "var(--Success)"}}><strong>Good</strong></span>;
        if (this.props.sortOption === "2") sorting = <span style={{color: "orange"}}><strong>Thorough</strong></span>;
        if (this.props.sortOption === "3") sorting = <span style={{color: "var(--Danger)"}}><strong>Overkill</strong></span>;

        //Check if start settings meet minimium requirements to continue
        let submitDisabled = true;
        if (this.props.scheduleOption && this.props.studentOption) submitDisabled = false;
        if (this.props.scheduleOption === "edit" && !this.props.selectedSchedule) submitDisabled = true;
        if (this.props.scheduleOption === "use" && !this.props.selectedSchedule) submitDisabled = true;
        if (this.props.studentOption === "edit" && !this.props.selectedStudentList) submitDisabled = true;

        return (
            <div className="Start">
                <h2>Start New Sort</h2>

                <form className="MainOptions" onSubmit={(event) => this.submitSettingsHandler(event)}>
                    <ul>

                        <li className="Options">
                            <h4>Schedule: </h4>
                            <Button
                                type={this.props.scheduleOption === "new" ? "Small Success active" : "Small Success"}
                                clicked={() => this.props.onSetScheduleOption("new")}
                                >Create New
                            </Button>
                            <Button
                                type={this.props.scheduleOption === "edit" ? "Small Info active" : "Small Info"}
                                clicked={() => this.props.onSetScheduleOption("edit")}
                                >Edit Saved
                            </Button>
                            <Button
                                type={this.props.scheduleOption === "use" ? "Small Danger active" : "Small Danger"}
                                clicked={() => this.props.onSetScheduleOption("use")}
                                >Use Saved
                            </Button>
                            {scheduleSelect}
                        </li>

                        <li className={this.props.scheduleOption === "new" || this.props.selectedSchedule ? null : "Hide"}>
                            {dividingLine}
                        </li>

                        <li className={this.props.scheduleOption === "new" || this.props.selectedSchedule ? "Options" : "Hide"}>
                            <h4>Student List: </h4>
                            <Button
                                type={this.props.studentOption === "new" ? "Small Success active" : "Small Success"}
                                clicked={() => this.props.onSetStudentOption("new")}
                                >New List
                            </Button>
                            <Button
                                type={this.props.studentOption === "edit" ? "Small Info active" : "Small Info"}
                                clicked={() => this.props.onSetStudentOption("edit")}
                                >From Saved
                            </Button>
                            {studentListSelect}
                        </li>

                        <li className={this.props.studentOption === "new" || this.props.selectedStudentList ? null : "Hide"}>
                            {dividingLine}
                        </li>

                        <li className={this.props.studentOption === "new" || this.props.selectedStudentList ? "Options" : "Hide"}>
                            <h4>Choices:</h4>
                            <div className="ChoiceSettings">
                                <div className="ChoiceSlider">
                                    <Slider
                                        min="0"
                                        max={choiceLimit}
                                        value={this.props.choiceOption}
                                        change={(event) => this.props.onSetChoiceOption(event.target.value)}
                                    />
                                </div>
                                <p>{this.props.choiceOption === -1 ? "Set" : this.props.choiceOption} choices per student</p>
                            </div>
                        </li>

                        <li className={this.props.choiceOption !== -1 ? null : "Hide"}>
                            {dividingLine}
                        </li>

                        <li className={this.props.choiceOption !== -1 ? "Options" : "Hide"}>
                            <h4>Duplicates:</h4>
                            <div className="DuplicateSettings">
                                <div className="ToggleArea">
                                    <ToggleSwitch check={this.props.choiceDuplicatesAllowed} change={this.props.onSetChoiceDuplicates} />
                                </div>
                                {duplicates}
                            </div>
                        </li>

                        <li className={this.props.choiceOption >= 0 ? null : "Hide"}>
                            {dividingLine}
                        </li>

                        <li className={this.props.choiceOption >= 0 ? "Options" : "Hide"}>
                            <h4>Sorting:</h4>
                            <div className="SortSettings">
                                <div className="SortSlider">
                                    <Slider
                                        min="0"
                                        max="3"
                                        value={this.props.sortOption}
                                        change={(event) => this.props.onSetSortOption(event.target.value)}
                                    />
                                </div>
                                <p>Sorting thoroughness set to : {sorting}</p>
                            </div>
                        </li>

                        <li className={this.props.sortOption >= 0 ? null : "Hide"}>
                            {dividingLine}
                        </li>

                        <li className={this.props.sortOption >= 0 ? "Options" : "Hide"}>
                            <h4>Get Started:</h4>
                            <input
                                className="Submit"
                                type="submit"
                                value="CONTINUE"
                                disabled={submitDisabled}
                            />
                        </li>
                    </ul>
                </form>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        localId: state.auth.localId,

        scheduleOption: state.start.scheduleOption,
        selectedSchedule: state.start.selectedSchedule,
        savedSchedules: state.start.savedSchedules,
        scheduleFetchError: state.start.scheduleFetchError,

        studentOption: state.start.studentOption,
        selectedStudentList: state.start.selectedStudentList,
        savedStudentLists: state.start.savedStudentLists,
        studentFetchError: state.start.studentFetchError,

        choiceOption: state.start.choiceOption,
        choiceDuplicatesAllowed: state.start.choiceDuplicatesAllowed,

        sortOption: state.start.sortOption,

        loading: state.start.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetScheduleOption: (option) => dispatch(actions.setScheduleOption(option)),
        onSelectSchedule: (schedule) => dispatch(actions.selectSchedule(schedule)),
        onInitLoadSavedSchedules: (token, localId) => dispatch(actions.initLoadSavedSchedules(token, localId)),

        onSetStudentOption: (option) => dispatch(actions.setStudentOption(option)),
        onSelectStudentList: (studentList) => dispatch(actions.selectStudentList(studentList)),
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
