import React, { Component } from 'react';
import { connect } from 'react-redux';

import './StudentSelect.css';
import StudentList from '../../components/StudentList/StudentList';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/indexActions';

class StudentSelect extends Component {
    state = {
        options: [],
        showModal: false,
        localError: null
    }

    componentDidMount () {
        this.setState({options: this.props.schedule.map(option => option.label)});

        if (this.props.studentOption === "new") {
            this.props.onAddNewStudent(this.props.choiceOption);
        } else {
            const setStudents = this.props.savedStudentLists[this.props.selectedStudentList].studentList;
            const setChoices = this.props.choiceOption;
            const setOptions = this.props.schedule.map(option => option.label);
            this.props.onSetStudentData(setStudents, setChoices, setOptions);
        }
    }

    componentDidUpdate () {
        if (this.props.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/results");
            }, 1000);
        }
    }

    goBackHandler = () => {
        this.props.onResetStudentData();
        if (this.props.scheduleOption === "use") this.props.onResetScheduleData();
        this.props.history.replace("/start");
    }

    continueModalHandler = () => {
        if (this.checkStudentListIsValid(this.props.students)) {
            this.setState({localError: null, showModal: true});
        } else {
            this.setState({localError: "Each student must have a name and different selection for each choice."});
        }
    }

    checkStudentListIsValid = () => {
        let namesValid = true;
        let choicesValid = true;
        for (let student of this.props.students) { // Check each student has a non-blank name
            if (student.name.trim() === "") {
                student.valid = false;
                namesValid = false;
            }
            if (!this.props.choiceDuplicatesAllowed) { // Check no duplicate choices if setting applied
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

    render () {
        //Check that a student list is not saved under same name
        let modalError = null;
        for (let studentList in this.props.savedStudentLists) {
            if (studentList === this.props.studentListTitle) {
                modalError = <p style={{color: "red"}}><strong>Cannot have the same name as another student list.</strong></p>
            }
        }

        let modalContent = <React.Fragment>
            <div>
                <h3>Save this student list and continue?</h3>
                <input
                    type="text"
                    value={this.props.studentListTitle ? this.props.studentListTitle : ""}
                    placeholder="Student List Title"
                    onChange={(event) => {this.props.onEditStudentListTitle(event.target.value)}}
                />
            </div>
            <Button
                type="Success"
                disabled={this.props.studentListTitle.trim() === ""}
                clicked={() => this.props.onSaveStudentsInit(this.props.studentListTitle, this.props.students, this.props.scheduleTitle, this.props.token, this.props.localId)}
                >Continue
            </Button>
            <Button
                type="Danger"
                clicked={() => this.setState({showModal: false})}
                >Cancel
            </Button>
            {modalError}
        </React.Fragment>
        if (this.props.loading) modalContent = <Spinner />
        if (this.props.saveAndContinue) modalContent = <h3 style={{color: "green"}}>STUDENT LIST SAVED!</h3>

        let errorMessage = null;
        if (this.props.networkError) errorMessage = <p style={{color: "red"}}>{this.props.networkError}</p>
        if (this.state.localError) errorMessage = <p style={{color: "red"}}>{this.state.localError}</p>

        let studentList = <StudentList
            students={this.props.students}
            choices={this.props.choiceOption}
            options={this.state.options}
            update={(studentIndex, dataType, data) => this.props.onUpdateStudentData(studentIndex, dataType, data)}
            delete={(studentId) => this.props.onDeleteStudent(studentId)}
        />
        if (this.props.loading) studentList = <Spinner />

        return (
            <div className="StudentSelect">
                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <h2>Student List Editor</h2>

                <div className="PageButtons">
                    <Button type="Danger" clicked={this.goBackHandler}>Go Back</Button>
                    <Button clicked={() => this.props.onAddNewStudent(this.props.choiceOption)}>Add Student</Button>
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
        token: state.auth.token,
        localId: state.auth.localId,

        scheduleOption: state.start.scheduleOption,
        selectedStudentList: state.start.selectedStudentList,

        studentOption: state.start.studentOption,
        savedStudentLists: state.start.savedStudentLists,

        choiceOption: state.start.choiceOption,
        choiceDuplicatesAllowed: state.start.choiceDuplicatesAllowed,

        schedule: state.schedule.schedule,
        scheduleTitle: state.schedule.scheduleTitle,

        students: state.students.students,
        studentListTitle: state.students.studentListTitle,
        saveAndContinue: state.students.saveAndContinue,
        loading: state.students.loading,
        networkError: state.students.networkError
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddNewStudent: (choices) => dispatch(actions.addNewStudent(choices)),
        onDeleteStudent: (studentId) => dispatch(actions.deleteStudent(studentId)),

        onUpdateStudentData: (studentIndex, dataType, data) => dispatch(actions.updateStudentData(studentIndex, dataType, data)),
        onEditStudentListTitle: (edit) => dispatch(actions.editStudentListTitle(edit)),
        onSaveStudentsInit: (studentListTitle, students, scheduleTitle, authToken, localId) => dispatch(actions.saveStudentsInit(studentListTitle, students, scheduleTitle, authToken, localId)),

        onSetStudentData: (students, choices, options) => dispatch(actions.setStudentData(students, choices, options)),
        onResetStudentData: () => dispatch(actions.resetStudentData()),
        onResetScheduleData: () => dispatch(actions.resetScheduleData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentSelect);
