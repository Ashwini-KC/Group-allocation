const { Op } = require('sequelize');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');
const Group = require('../models/group.model');


const getGroups = async(req,res)=>{
    
    try {
        const groups = await Group.findAll({ include:[
            {
                model: Topic,
                attributes:['title', "userEmail"]
            },
                {
                  model: User,
                  attributes: ["email"],
                  through: {model: Group.GroupUser, attributes: []}
                }
        ]});
        
        res.json({groups})
    } catch(error){
        res.status(500).json({ error: 'Server Error' });
    }
}


const getStudentGroup = async(req,res) =>{
    try{
        const user = req.user;
        const studentGroups = await Group.findAll({
            include: [
                {
                    model: Topic,
                    attributes: ['title', 'userEmail']
                },
                {
                    model: User,
                    attributes: ['email'],
                }
            ],
            through: {
                attributes: []
            }
        });

        const groups = studentGroups.filter(group => group.users.find(u=> u.email === user.email))

        const revised = groups.map(group => ({
            id: group.id,
            supervisor: group.topic.userEmail,
            topic: {
                id: group.topicId,
                title: group.topic.title
            },
            students: group.users.map(u => u.email)
        }))
        res.json({groups: revised})
       
    }
    catch(error){
        res.status(500).json({error: 'Server Error'})
    }
}

const getSupervisorGroup = async(req,res) =>{
    try{
        const user = req.user;
        const supervisorGroup = await Group.findAll({
            include: [
                {
                    model: Topic,
                    attributes: ['title', 'userEmail']
                },
                {
                    model: User,
                    attributes: ['email'],
                }
            ],
            through: {
                attributes: []
            }
        });

        const groups = supervisorGroup.filter(group => group.topic.userEmail == user.email)

        const revised = groups.map(group => ({
            id: group.id,
            supervisor: group.topic.userEmail,
            topic: {
                id: group.topicId,
                title: group.topic.title
            },
            students: group.users.map(u => u.email)
        }))
        res.json({groups: revised})
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Server Error'})
    }
}

const deleteGroups = async(req,res)=>{
    try{
        await Group.destroy({where: {}});
        res.json({message: "All groups deleted"})
    }catch(error){
        res.status(500).json({ error: 'Server Error' });
    }
}


module.exports = {
getGroups,
getStudentGroup,
getSupervisorGroup,
deleteGroups
}
