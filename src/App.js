import './App.css';
import Container from './Container';
import Footer from './Footer';
import {getAllStudents} from './client';
import AddStudentForm from './forms/AddStudentForm'
import React, {Component} from 'react';
import { errorNotification } from './Notification';
import { LoadingOutlined } from '@ant-design/icons';
import{
  Table, Avatar, Spin, Modal, Empty
} from 'antd';

const getIndicatorIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;

class App extends Component{

  state = {
    students: [],
    isFetching: false,
    isAddStudentModalVisible: false
  }

  componentDidMount (){
    this.fetchStudents();
  }

  openAddStudentModal = () => this.setState({isAddStudentModalVisible: true})

  closeAddStudentModal = () => this.setState({isAddStudentModalVisible: false})

  fetchStudents = () => {
    this.setState({
      isFetching: true
    });
    getAllStudents()
    .then(res => res.json()
    .then(students => {
      console.log(students);
      this.setState({
        students,
        isFetching: false
      });
    }))
    .catch(err => {
      err.response.json().then(e => {
        const message = e.message;
        const description = e.error;
        errorNotification(message, description);
      });
      // const message = error.error.message;
      // 
      this.setState({
        isFetching: false
      });
    });
  }

  render(){

    const { students, isFetching, isAddStudentModalVisible } = this.state;

    const commonElements = () => (
      <div>
        <Modal
        title='Add new student'
        visible={isAddStudentModalVisible}
        onOk={this.closeAddStudentModal}
        onCancel={this.closeAddStudentModal}
        width={800}>
          <AddStudentForm
            onSuccess={() => {this.closeAddStudentModal();
                              this.fetchStudents();
            }} 
            onFailure={(err) => {
              err.response.json().then(e => {
                const message = e.message;
                const description = e.httpStatus;
                errorNotification(message, description);
              });
              // const message = err.error.message;
              // const description = err.error.httpStatus;
              // errorNotification(message, description);
            }}
          />
      </Modal>

      <Footer 
        numberOfStudents={students.length}
        handleAddStudentClickEvent={this.openAddStudentModal}
        />
      </div>
    )

    if(isFetching){
      return (
        <Container>
          <Spin indicator={getIndicatorIcon()} />
        </Container>
      );
    }

    if(students && students.length){

      

    const columns = [
      {
        title: '',
        key: 'avatar',
        render: (text, student) => (
          <Avatar size='large'>
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
          </Avatar>
        )
      },
      {
        title: 'Student Id',
        dataIndex: 'studentId',
        key: 'studentId'
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender'
      }
    ];

    return (
    <Container>
      <Table 
        style={{paddingBottom: '100px'}}
        
        dataSource={students} 
        columns={columns} 
        pagination={false}
        rowKey='studentId' />

        {commonElements()}
        
      </Container>);
  
  }

    return (
      <Container>
        <Empty description={<h1>No Students found</h1>} />
        {commonElements()}
      </Container>
    )

  }
}

export default App;
