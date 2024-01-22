const { Op } = require('sequelize');
const Preference = require('../models/preference.model');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');
const Group = require('../models/group.model');
const emailSender = require('../utils/emailService');

const findTopicsByPriority = async (req, res) => {
    try {

        const maxGroupSize = Number(req.body.groupSize) || 5;
        // console.log(maxGroupSize)
        if(maxGroupSize < 2 || maxGroupSize > 10 ){
            return res.status(400).json({error: "Group size should be more than 2 and less than 10"})
        }
        //Check for groups, if exists throw error
        const groupsExist = await Group.findAll();
        if(groupsExist.length > 0){
            return res.json({ message: "Groups already formed."})
        }
        //If no group exist, fetch students and their preferences
        const students = await User.findAll({
            where: { role: 'Student' },
            include: { model: Preference, as: 'preferences', order: [['priority', 'ASC']] },
            order: [[{ model: Preference }, 'updatedAt', 'ASC']]
        });

        const studentsWithPreferences = students.filter(student => student.preferences.length > 0);
        let studentsWithoutPreferences = students.filter(student => student.preferences.length === 0);
        //map only student emails of student without preferences
        studentsWithoutPreferences = studentsWithoutPreferences.map(student => student.email);
        
        const studentPreferences = new Map();
        //Sort each students preferences in order of their priority
        studentsWithPreferences.forEach(student => {
            let preferences = student.preferences.sort((a,b) => a.priority-b.priority)
            studentPreferences.set(student.email, preferences);
        });
        //Two map objects to store key and values
        const groupAssignments = new Map();
        const groupTracker = new Map();

        //Function to get available topics
        const getNextAvailableTopic = (studentEmail) => {
            //Get student preferences for each student
            const preferences = studentPreferences.get(studentEmail);
            for (const preference of preferences) {
                //if topicId is not present in group assignment then set topicId and array to group size
                if (!groupAssignments.get(preference.topicId)) {
                    groupAssignments.set(preference.topicId, []);
                    groupTracker.set(preference.topicId, maxGroupSize);
                }
                if (groupAssignments.get(preference.topicId).length < maxGroupSize) {
                    return preference.topicId;
                } else {
                    //grouptracker has topicId of preferences
                    groupTracker.delete(preference.topicId);
                }
            }
            //Returns null when all preffered topics are full
            return null;
        };

        for (const student of studentsWithPreferences) {
            //Get topic that is available from the function
            const availableTopic = getNextAvailableTopic(student.email);
            if (availableTopic !== null) {
                groupAssignments.get(availableTopic).push( student.email);
                const availability = groupTracker.get(availableTopic);
                groupTracker.set(availableTopic, availability - 1);
                if (groupTracker.get(availableTopic) === 0) {
                    groupTracker.delete(availableTopic);
                }
            } //If all preferences are full then push student to SWP
            else {
                studentsWithoutPreferences.push(student.email);
            }
        }
        
        if (studentsWithoutPreferences.length > 0) {
            for (const student of studentsWithoutPreferences) {
                if (groupTracker.size > 0) {
                    const [topicId, availability] = groupTracker.entries().next().value;
                    groupAssignments.get(topicId).push(student);
                    groupTracker.set(topicId, availability - 1);
                    if (groupTracker.get(topicId) === 0) {
                        groupTracker.delete(topicId);
                    }
                }//If no topic space avaiable in groupassignment then find unpreffered topics 
                else {
                    let topic = await Topic.findOne({
                        where: {
                            id: {
                                [Op.notIn]: Array.from(groupAssignments.keys())
                            }
                        }
                    });
                    //if no topics are available
                    if(!topic){
                        return res.status(500).json({ error: "Insuffecient topics."})
                    }
                    groupTracker.set(topic.id, maxGroupSize - 1)
                    groupAssignments.set(topic.id, [student])
                }
            }
        }
        //Group creation
        for(const [topicId, students] of groupAssignments){
           
            const group = await Group.create();
            let groupStudents = await User.findAll({
                where: {
                    email: {
                        [Op.in]: students
                    }
                }
            })
            await group.setTopic(topicId);
            await group.addUser(groupStudents);
//             if(students.find(student => student ==='akc17@student.le.ac.uk')){

                
//                 const topic = await Topic.findByPk(topicId);
//                 const message = `
// <h1>Group Number: ${group.id}</h1>
// <h2>Title: ${topic.title}</h2>
// <h3Supervisor: ${topic.userEmail}</h3>
// <h3>Students:
//     ${students.join("\n    ")}</h3>
// `
//                 const response = await emailSender(
//                     [{ address: 'akc17@student.le.ac.uk', displayName: "Ashwini KC",}],
//                     "Groups have been allocated",
//                     message);
        
//                 console.log(message);

//             }

        }

        res.json([...groupAssignments]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    findTopicsByPriority
};

