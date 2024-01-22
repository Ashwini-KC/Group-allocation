const Preference =require('../models/preference.model');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');

const postPreference = async (req,res)=>{

    let user=req.user
    if(user.role == 'Admin'){
      user.email = req.body.studentEmail
    }
    const existingPreferences = await Preference.findAll({
        where: {
          userEmail: user.email,
        },
      });
    
      const { first,second,third,fourth} = req.body
      
      if(!first || !second || !third || !fourth){
        return res.status(400).json({error:"Plese select 4 preferences"})
      }
      const priorityOneTopic=await Topic.findByPk(first)
      const priorityTwoTopic=await Topic.findByPk(second)
      const priorityThreeTopic=await Topic.findByPk(third)
      const priorityFourTopic=await Topic.findByPk(fourth)

      if(!priorityOneTopic || !priorityTwoTopic || !priorityThreeTopic || !priorityFourTopic){
        return res.status(400).json({error: "Invalid topics."})
    }

      if (existingPreferences.length > 0) {
        await Preference.update({priority: 1, userEmail: user.email, topicId: first }, {
            where: {
                userEmail: user.email,
                priority: 1
            },
            
        })
        await Preference.update({priority: 2, userEmail: user.email, topicId: second }, {
            where: {
                userEmail: user.email,
                priority: 2
            },
        })
        await Preference.update({priority: 3, userEmail: user.email, topicId: third }, {
            where: {
                userEmail: user.email,
                priority: 3
            },
        })
        await Preference.update({priority: 4, userEmail: user.email, topicId: fourth }, {
            where: {
                userEmail: user.email,
                priority: 4
            },
        })
        return res.json({ message: "Updated Succesfully"});
      }
      
    
    const preferences = await Preference.bulkCreate([
        {
        priority: 1,
        userEmail: user.email,
        topicId: first
        }, 
        {
            priority: 2,
            userEmail: user.email,
            topicId: second
        }, 
        {
            priority: 3,
            userEmail: user.email,
            topicId: third
            }, 
            {
                priority: 4,
                userEmail: user.email,
                topicId: fourth
            },
    ]);

    const studentPreferences = await User.findByPk(user.email, { include: [
        {
          model: Preference,
          attributes: ['priority'], 
          include: { model: Topic, attributes: ["title", "id", "description"] },
        },
      ], })

    res.json({ message: "Preferences set."})
}


const getPreferences = async (req,res) => {
    const user=req.query.userEmail
    const isAdmin = req.query.isAdmin === 'true';
    let preferences
    if(user || isAdmin){
        preferences = await Preference.findAll({
            where:{
                userEmail: user
            },
            attributes: ['priority'], 
          include: {
            model: Topic,
            attributes: ['title', 'id', 'description'], 
          },
        });
    }
   else{
     preferences = await Preference.findAll({
        attributes: ['priority'], 
        include: {
          model: Topic,
          attributes: ['title', 'id', 'description'], 
        },
     })  

   }
    res.json(preferences)

}

module.exports={
    postPreference,
    getPreferences
};