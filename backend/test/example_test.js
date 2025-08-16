const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { expect } = chai;

describe('Task Controller', () => {

  afterEach(() => {
    sinon.restore();
  });


  it('should create a new task successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'New Task', description: 'Task description' }
    };
    const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    const createStub = sinon.stub(Task, 'create').resolves(createdTask);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createTask(req, res);

    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTask)).to.be.true;
  });


  it('should return all tasks for a user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = { user: { id: userId } };
    const tasks = [{ _id: new mongoose.Types.ObjectId(), title: 'Task1', userId }];

    const findStub = sinon.stub(Task, 'find').resolves(tasks);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getTasks(req, res);

    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(tasks)).to.be.true;
  });


  it('should update a task successfully', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId }, body: { title: 'Updated Task' } };
    const updatedTask = { _id: taskId, title: 'Updated Task' };

    const updateStub = sinon.stub(Task, 'findByIdAndUpdate').resolves(updatedTask);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateTask(req, res);

    expect(updateStub.calledOnceWith(taskId, req.body, { new: true })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedTask)).to.be.true;
  });


  it('should delete a task successfully', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId } };
    const deletedTask = { _id: taskId };

    const deleteStub = sinon.stub(Task, 'findByIdAndDelete').resolves(deletedTask);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteTask(req, res);

    expect(deleteStub.calledOnceWith(taskId)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Deleted successfully' })).to.be.true;
  });
  it('getTasks: should return 500 on DB error', async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = { user: { id: userId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Task, 'find').throws(new Error('DB Error in find'));

    await getTasks(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error in find' })).to.be.true;
  });

  // UPDATE: task not found
  it('updateTask: should return 404 when task not found', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId }, body: { title: 'Nope' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Task, 'findByIdAndUpdate').resolves(null);

    await updateTask(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Task not found' })).to.be.true;
  });

  // UPDATE: DB error
  it('updateTask: should return 500 on DB error', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId }, body: { title: 'X' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Task, 'findByIdAndUpdate').throws(new Error('DB Error in update'));

    await updateTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error in update' })).to.be.true;
  });

  // DELETE: task not found
  it('deleteTask: should return 404 when task not found', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Task, 'findByIdAndDelete').resolves(null);

    await deleteTask(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Task not found' })).to.be.true;
  });

  // DELETE: DB error
  it('deleteTask: should return 500 on DB error', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const req = { params: { id: taskId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Task, 'findByIdAndDelete').throws(new Error('DB Error in delete'));

    await deleteTask(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error in delete' })).to.be.true;
  });
});
