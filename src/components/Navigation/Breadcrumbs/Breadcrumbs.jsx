import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../../utils/sharedFunctions';

import './Breadcrumbs.css';

import Button from '../../UI/Button/Button';
import Select from '../../UI/Select/Select';

const Breadcrumbs = (props) => {

    const fromSaveToOptionsHandler = (saveObject) => {
        if (Object.keys(saveObject).length === 0) {
            return ["No Start Settings Found"];
        } else {
            const allOptions = Object.values(saveObject).map(value => value.title);
            return allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);

        }
    }

    const setScheduleHandler = (event) => {
        const saved = getMostRecentSaveOf(props.schedule.savedSchedules, event.target.value);
        props.onApplySelectedStartSettingsOption(saved.matchingStartSettings);
        props.onToggleStartSettingsContinue();
        props.onApplySelectedScheduleOption(event.target.value);
        props.history.replace("/new-sort/schedule");
    };

    let startCrumb = <Button clicked={() => props.history.replace("/new-sort")}>{props.start.title}</Button>
    if (props.history.location.pathname === "/new-sort") {
        startCrumb = <Select
            type="OnPage"
            label={props.start.loading ? "Loading..." : "Load Start Settings"}
            options={fromSaveToOptionsHandler(props.start.savedStartSettings)}
            value={props.start.title}
            disabled={Object.keys(props.start.savedStartSettings).length === 0}
            clicked={(event) => props.onApplySelectedStartSettingsOption(event.target.value)}
        />
    }

    let scheduleCrumb = <Select
        type={window.location.pathname === "/new-sort/schedule" ? "OnPage" : null}
        label={props.start.loading ? "Loading..." : "Load Schedule"}
        options={fromSaveToOptionsHandler(props.schedule.savedSchedules)}
        value={props.schedule.scheduleTitle}
        disabled={Object.keys(props.start.savedStartSettings).length === 0}
        clicked={(event) => setScheduleHandler(event)}
    />
    if (props.history.location.pathname === "/new-sort/students") {
        scheduleCrumb = <Button
            clicked={props.history.replace("/new-sort/schedule")}
            >{props.schedule.scheduleTitle}
        </Button>
    }

    const studentsCrumb = <Select
        type={window.location.pathname === "/new-sort/students" ? "OnPage" : null}
        label={props.students.loading ? "Loading..." : "Load Student List"}
        options={fromSaveToOptionsHandler(props.students.savedStudentLists)}
        value={props.students.studentListTitle}
        disabled={Object.keys(props.students.savedStudentLists).length === 0}
        clicked={(event) => props.onApplySelectedStartSettingsOption(event.target.value)}
    />

    return (
        <div className="Breadcrumbs">
            {startCrumb}
            <h3>></h3>
            {scheduleCrumb}
            <h3>></h3>
            {studentsCrumb}
        </div>
    );

};

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
        onToggleStartSettingsContinue: () => dispatch(actions.toggleStartSettingsContinue()),

        onApplySelectedScheduleOption: (selectedSchedule) => dispatch(actions.applySelectedScheduleOption(selectedSchedule)),

        onApplySelectedStudentListOption: (selectedStudentList) => dispatch(actions.applySelectedStudentListOption(selectedStudentList)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
