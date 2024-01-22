const { Op } = require('sequelize');
const User = require('../models/user.model')

const viewStudents = async (req,res) => {
    try{
        const user = req.user;
        const students = await User.findAll({
            where : {
                role : 'Student'
            },
            attributes: ['name', 'email', 'department', 'course']
        })
        res.json(students)
    }
    catch(error){
        res.sendStatus(500)
    }
}

const searchStudents = async (req,res) =>{
    try{
        const users = req.user;
        const { name } = req.query;
        if(req.user.role != 'Admin'){
            return res.status(500).json({error : 'User is Forbidden to access'})
        }
        const students = await User.findAll({
            where: {
                role : 'Student',
                name : {[Op.like]: `%${name}%`},
            },
            attributes: ['name', 'email', 'department', 'course']
        })
        res.json(students)
        }
        catch(error){
            res.status(500).json({error : "Internal Server error"})
        } 
}

const searchSupervisors = async (req,res) =>{
    try{
        const users = req.user;
        const { name } = req.query;
        if(req.user.role != 'Admin'){
            return res.status(500).json({error : 'User is Forbidden to access'})
        }
        const supervisor = await User.findAll({
            where: {
                role : 'Supervisor',
                name : {[Op.like]: `%${name}%`},
            }
        })
        res.json(supervisor)
        }
        catch(error){
            res.status(500).json({error : "Internal Server error"})
        } 
}
const viewSupervisors = async (req,res) => {
    try{
        const user = req.user;
        const supervisors = await User.findAll({
            where : {
                role : 'Supervisor'
            },
            attributes: ['name', 'email', 'department']
        })
        res.json(supervisors)
    }
    catch(error){
        res.sendStatus(500)
    }
}

const deleteStudents = async(req,res)=>{
    const { email } = req.body
    // check if topic with certain id exists in the database
    const studentExists = await User.findOne({
        where :{
            email
        }
    });

    if(!studentExists){
        return res.sendStatus(404)
    }
    try{
        const students= await User.destroy({where: 
            {email}
        });
        res.json({message:"Successfully deleted"})
    } catch(e){
        res.sendStatus(500)
    }
}

const deleteSupervisors = async (req,res) => {
    const { email } =req.body

    const supervisorExists = await User.findOne({
        where :{
            email
        }
    });
    if(!supervisorExists){
        return res.sendStatus(404)
    }
    try{
        const supervisor = await User.destroy({ where : 
            {email}
        });
        res.json({message : "Successfully deleted"})
    }catch(e){
        res.sendStatus(500)
    }
}


const updateStudents = async(req,res) => {
    try{
        const {name,email,department,course} = req.body
        const studentExists = await User.findOne({
            where: {
                email: email.trim()
            }
        });
        if(!studentExists){
        return res.sendStatus(404)
    }
        const updateStudent = await User.update({name, email, department, course},{
            where :{
                email: studentExists.email
            }
        });
        res.json({message : "Successfully updated"})
    }catch(e){
        res.sendStatus(500)
    }
}

const updateSupervisors = async (req,res) => {
    const {name,email,department} = req.body
    const supervisorExists = await User.findByPk(email);

    try{
        if(!supervisorExists){
            return res.sendStatus(404)
        }
            const updateSupervisor = await User.update({name: name, email : email, department: department},{
                where :{
                    email
                }
            })
            res.json({message : "Successfully updated"})
        }catch(e){
            res.sendStatus(500)
        }
    
}

module.exports= {
    viewStudents,
    viewSupervisors,
    deleteStudents,
    deleteSupervisors,
    updateStudents,
    updateSupervisors,
    searchStudents,
    searchSupervisors
}
