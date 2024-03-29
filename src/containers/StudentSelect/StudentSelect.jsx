import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/indexActions';
import { getMostRecentSaveOf } from '../../utils/sharedFunctions';

import './StudentSelect.css';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
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
        this.props.onToggleStudentContinue(false);
        this.setState({options: this.props.schedule.schedule.map(option => option.label)});
    }

    componentDidUpdate () {
        if (this.props.students.students.length === 0) this.props.onAddNewStudent(this.props.start.studentChoices);

        if (this.props.students.saveAndContinue) {
            setTimeout(() => {
                this.props.history.replace("/results");
            }, 1000);
        }
    }

    checkStudentListIsValid = () => {
        let namesValid = true;
        let choicesValid = true;
        for (let i = 0; i < this.props.students.students.length; i++) {
            if (this.props.students.students[i].name.trim() === "") { //check for blank student names
                this.props.onUpdateStudentData(i, "valid", false);
                namesValid = false;
            }
            const temp = this.props.students.students[i]; //Store current student as temp variable
            for (let j = i+1; j < this.props.students.students.length; j++) { //Look through rest of array forwards
                if (this.props.students.students[j].name === temp.name) { //Check for duplicate student names
                    this.props.onUpdateStudentData(i, "valid", false);
                    this.props.onUpdateStudentData(j, "valid", false);
                    namesValid = false;
                }
            }
            for (let choice of temp.choices) { //Loop through choices of each student
                if (choice.trim() === "" ) { //Check for missing/empty choices
                    this.props.onUpdateStudentData(i, "valid", false);
                    choicesValid = false;
                }
            }
            if (!this.props.start.choiceDuplicatesAllowed) { //If duplicate choices are not allowed
                if (new Set(temp.choices).size !== temp.choices.length) { //Check for duplicates in choices array
                    this.props.onUpdateStudentData(i, "valid", false);
                    choicesValid = false;
                }
            }
        }
        return namesValid && choicesValid;
    }

    continueModalHandler = () => {
        if (this.checkStudentListIsValid(this.props.students.students)) {
            this.setState({localError: null, showModal: true});
            for (let i = 0; i < this.props.students.students.length; i++) { //In case duplicate students fixed
                this.props.onUpdateStudentData(i, "valid", true); //Set all students to "valid" after checking
            }
        } else {
            if (!this.props.start.choiceDuplicatesAllowed) {
                this.setState({localError: "Each student must have a unique name and different choices based on your start settings."})
            } else {
                this.setState({localError: "Each student must have a unique name. Choices cannot be left empty."});
            }
        }
    }

    saveStudentListHandler = () => {
        const saved = getMostRecentSaveOf(this.props.students.savedStudentLists, this.props.students.title);
        // !!!WARNING: The following order MATTERS - make sure keys are listed alphabetically
        const currentData = {
            matchingSchedule: this.props.schedule.title,
            matchingStartSettings: this.props.start.title,
            students: this.props.students.students,
            title: this.props.students.title,
            userId: this.props.auth.localId,
        };
        if (JSON.stringify(saved) === JSON.stringify(currentData)) { //Check if current data is same as saved data
            this.props.onToggleStudentContinue(true);
        } else { //Only save to database if they are different
            this.props.onSaveStudentsInit(currentData, this.props.auth.token);
        }
    }

    render () {
        let modalContent = <React.Fragment>
            <div>
                {this.props.students.networkError ? <p><span style={{color: "red"}}>{this.props.students.networkError}</span></p>: null}
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
            choices={this.props.start.studentChoices}
            options={this.state.options}
            students={this.props.students.students}
            add={(choices) => this.props.onAddNewStudent(choices)}
            update={(studentIndex, dataType, data) => this.props.onUpdateStudentData(studentIndex, dataType, data)}
            delete={(studentId) => this.props.onDeleteStudent(studentId)}
        />

        if (this.props.students.loading) {
            modalContent = <Spinner />;
            studentList = <Spinner />;
        }

        let studentMotion = {
            initial: {transform: "translate(100vw, 0vh)"},
            animate: {opacity: 1, transform: "translate(0vw, 0vh)"},
            exit: {transform: "translate(100vw, 0vh)"},
            transition: {duration: 0.5, type: "tween"},
        };
        if (this.props.students.saveAndContinue) studentMotion.exit = {opacity: 0, transform: "translate(-100vw, 0vh"};


        return (
            <motion.div
                className="StudentSelect"
                initial={studentMotion.initial}
                animate={studentMotion.animate}
                exit={studentMotion.exit}
                transition={studentMotion.transition}
            >

                <Breadcrumbs history={this.props.history} />

                <Modal show={this.state.showModal} toggle={() => this.setState({showModal: false})}>
                    {modalContent}
                </Modal>

                <div className="TitleArea">
                    <h2>Student List Editor</h2>
                    <Button type="Success" clicked={this.continueModalHandler}>CONTINUE</Button>
                </div>

                {errorMessage}

                <div className="TableArea">
                    {studentList}
                </div>
            </motion.div>
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
