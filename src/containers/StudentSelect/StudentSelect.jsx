import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../utils/sharedFunctions';

import './StudentSelect.css';
import StudentList from '../../components/StudentList/StudentList';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

class StudentSelect extends Component {
    state = {
        options: [],
        showModal: false,
        localError: null,
    }

    componentDidMount () {
        if (this.props.students.students.length === 0) {
            this.props.onAddNewStudent(this.props.start.studentChoices);
        }
        this.setState({options: this.props.schedule.schedule.map(option => option.label)});
    }

    componentDidUpdate () {
        if (this.props.students.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/results");
            }, 1000);
        }
    }

    continueModalHandler = () => {
        if (this.checkStudentListIsValid(this.props.students.students)) {
            this.setState({localError: null, showModal: true});
        } else {
            this.setState({localError: "Each student must have a name and different selection for each choice."});
        }
    }

    checkStudentListIsValid = () => {
        let namesValid = true;
        let choicesValid = true;
        for (let student of this.props.students.students) { // Check each student has a non-blank name
            if (student.name.trim() === "") {
                student.valid = false;
                namesValid = false;
            }
            if (!this.props.start.choiceDuplicatesAllowed) { // Check no duplicate choices if setting applied
                if (new Set(student.choices).size !== student.choices.length) {
                    student.valid = false;
                    choicesValid = false;
                }
            }
            for (let choice of student.choices) { //Check choices for each student are non-blank
                if (choice.trim() === "") {
                    student.valid = false;
                    choicesValid = false;
                }
            }
        }
        return namesValid && choicesValid;
    }

    saveStudentListHandler = () => {
        const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, this.props.students.title);
        const currentData = {
            matchingSchedule: this.props.schedule.title,
            matchingStartSettings: this.props.start.title,
            students: this.props.students.students,
            title: this.props.students.title,
            userId: this.props.auth.localId,
        };
        //Check if current data is same as saved data and only save if different
        if (JSON.stringify(saved) === JSON.stringify(currentData)) {
            this.props.onToggleStudentContinue(true);
        } else {
            this.props.onSaveStudentsInit(currentData, this.props.auth.token);
        }
    }

    render () {
        let modalContent = <React.Fragment>
            <div>
                <h3>Save This Student List And Continue?</h3>
                <input
                    type="text"
                    value={this.props.students.title ? this.props.students.title : ""}
                    placeholder="Student List Title"
                    onChange={(event) => {this.props.onEditStudentListTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.students.title.trim() === ""}
                clicked={this.saveStudentListHandler}
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >Cancel
            </Button>
        </React.Fragment>
        if (this.props.students.saveAndContinue) modalContent = <h3 style={{color: "green"}}>STUDENT LIST SAVED!</h3>

        let errorMessage = null;
        if (this.props.students.networkError) errorMessage = <p style={{color: "red"}}>{this.props.students.networkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let studentList = <StudentList
            students={this.props.students.students}
            choices={this.props.start.studentChoices}
            options={this.state.options}
            add={(choices) => this.props.onAddNewStudent(choices)}
            update={(studentIndex, dataType, data) => this.props.onUpdateStudentData(studentIndex, dataType, data)}
            delete={(studentId) => this.props.onDeleteStudent(studentId)}
        />
        if (this.props.students.loading) {
            modalContent = <Spinner />;
            studentList = <Spinner />;
        }

        return (
            <div className="StudentSelect">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <div className="TitleArea">
                    <h2>Student List Editor</h2>
                    <Button type="Success" clicked={this.continueModalHandler}>Continue</Button>
                </div>

                {errorMessage}

                <div className="TableArea">
                    {studentList}
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
        onAddNewStudent: (choices) => dispatch(actions.addNewStudent(choices)),
        onDeleteStudent: (studentId) => dispatch(actions.deleteStudent(studentId)),
        onUpdateStudentData: (studentIndex, dataType, data) => dispatch(actions.updateStudentData(studentIndex, dataType, data)),

        onEditStudentListTitle: (edit) => dispatch(actions.editStudentListTitle(edit)),
        onToggleStudentContinue: (desiredSetting) => dispatch(actions.toggleStudentListContinue(desiredSetting)),

        onSaveStudentsInit: (studentListTitle, students, scheduleTitle, authToken, localId) => dispatch(actions.saveStudentsInit(studentListTitle, students, scheduleTitle, authToken, localId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentSelect);
