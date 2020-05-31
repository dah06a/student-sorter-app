import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/indexActions';

import './Breadcrumbs.css';

import Button from '../../UI/Button/Button';
import Select from '../../UI/Select/Select';

const saveObjectToOptions = (saveObject) => {
    if (Object.keys(saveObject).length === 0) {
        return ["No Start Settings Found"];
    } else {
        const allOptions = Object.values(saveObject).map(value => value.title);
        return allOptions.filter((opt, i) => allOptions.indexOf(opt) === i);

    }
}

const Breadcrumbs = (props) => {

    let startCrumb = <Button
        clicked={() => props.history.replace("/new-sort")}
        >Edit Start Settings
    </Button>

    if (props.history.location.pathname === "/new-sort") {
        startCrumb = <Select
            type="OnPage"
            label={props.start.loading ? "Loading..." : "Load Start Settings"}
            options={saveObjectToOptions(props.start.savedStartSettings)}
            value={props.start.startSettingsTitle}
            disabled={Object.keys(props.start.savedStartSettings).length === 0}
            clicked={(event) => props.onApplySelectedStartSettingsOption(event.target.value)}
        />
    }

    let scheduleCrumb = <Select
        type={window.location.pathname === "/new-sort/schedule" ? "OnPage" : null}
        label={props.start.loading ? "Loading..." : "Load Schedule"}
        options={saveObjectToOptions(props.schedule.savedSchedules)}
        value={props.schedule.scheduleTitle}
        disabled={Object.keys(props.start.savedStartSettings).length === 0}
        clicked={(event) => {
            const matchingSchedules = Object.entries(props.schedule.savedSchedules).filter(schedule => schedule[1].title === event.target.value);
            let mostRecent = matchingSchedules[0];
            for (let schedule of matchingSchedules) { //Get most recent schedule by comparing key values (saved date)
                if (schedule[0] > mostRecent[0]) mostRecent = schedule;
            }
            props.onApplySelectedStartSettingsOption(mostRecent[1].matchingStartSettings);
            props.onApplySelectedScheduleOption(event.target.value);
            props.history.replace("/new-sort/schedule");
        }}
    />

    if (props.history.location.pathname === "/new-sort/students") {
        scheduleCrumb = <Button
            clicked={props.history.replace("/new-sort/schedule")}
            >Edit Schedule
        </Button>
    }

    const studentsCrumb = <Select
        type={window.location.pathname === "/new-sort/students" ? "OnPage" : null}
        label={props.students.loading ? "Loading..." : "Load Student List"}
        options={saveObjectToOptions(props.students.savedStudentLists)}
        value={props.students.studentListTitle}
        disabled={Object.keys(props.start.savedStartSettings).length === 0}
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
