import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function () {
    const [employees, setEmployees] = useState([]); // 'employees' holds the current state, setEmployees is the function used to update the state of 'employees', initially it is set to an empty array
    
    const [newEmployeeName, setNewEmployeeName] = useState(''); // for when new employees are added by the user/updated
    const [newEmployeeValue, setNewEmployeeValue] = useState('');

    const [isEditing, setIsEditing] = useState(false); // To see if we are currently updating an employee (are we in edit/add mode)

    const formRef = useRef(null);
    

    useEffect(() => {
        getEmployees().then(data => setEmployees(data)); // useEffect hook is used to fetch data from the database
    }, []);

    async function getEmployees() {
        return fetch("/employees").then(response => response.json());
    }

    async function createEmployee(name, value) {
        return fetch("/employees", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value })
        });
    }

    async function updateEmployee(name, value) {
        return fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value })
        });
    }

    async function handleAddingNewEmployee() {
        await createEmployee(newEmployeeName, newEmployeeValue); // Wait until the createEmployee function completes and the employee is added to the database before moving on

        setNewEmployeeName(''); // This resets these fields to blank once the user adds a new employee
        setNewEmployeeValue('');

        const updatedEmployees = await getEmployees();
        setEmployees(updatedEmployees);
    }

    async function handleUpdateEmployee() {
        await updateEmployee(newEmployeeName, newEmployeeValue); // Wait until the updateEmployee function completes and the employee is updated in the database

        setNewEmployeeName('');
        setNewEmployeeValue('');
        setIsEditing(false); // Exit edit mode

        const updatedEmployees = await getEmployees();
        setEmployees(updatedEmployees); // Refreshes and updates the list of employees
    }

    function handleUpdateClick(employee) {
        setIsEditing(true); // Enter edit mode
        setNewEmployeeName(employee.name);
        setNewEmployeeValue(employee.value);
        formRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div>
            <img src="/unnamed.jpg" alt="Logo" /> 
            <h1>Employee List</h1>  

            <ul>
                {employees.map((employee, index) => ( // Iterating and creating an object for each employee in the list, consisting of the employee's name and value
                    <li key={index} className='employee-item'>  
                        {employee.name} : {employee.value}
                        <button onClick={() => handleUpdateClick(employee)} className='update-button'>Edit</button>       
                    </li>   
                ))}
            </ul>

            <div className='form' ref={formRef}>
                <input
                    type='text'
                    placeholder={isEditing ? 'Update Employee Name' : 'Employee Name'}
                    value={newEmployeeName}
                    readOnly={isEditing != false}
                    onChange={(e) => setNewEmployeeName(e.target.value)}    
                />          

                <input
                    type='number'
                    placeholder={isEditing ? 'Update Employee Value' : 'Employee Value'}
                    value={newEmployeeValue} // Value represents whatever name the user enters
                    onChange={(e) => setNewEmployeeValue(e.target.value)}
                /> 

                {isEditing ? (
                    <button onClick={handleUpdateEmployee}>Update Employee</button>
                ) : (
                    <button onClick={handleAddingNewEmployee}>Add Employee</button>
                )}
            </div>    
        </div>
    );
}
