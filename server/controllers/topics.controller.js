const { where } = require("sequelize");
const Topic = require("../models/topic.model");
const {Op}= require("sequelize");

const postTopic = async (req, res) => {

    const { title, description } = req.body;
    const user = req.user;

    const topicExists = await Topic.findOne({
        where: {
            title
        }
    });
    
    if(topicExists){
        console.log(topicExists)
        return res.status(400).json({error: "Topic exists"})
    }
    if( title == "" || description == ""){
        return res.status(400).json({error: "Fields cannot be Empty"})
    }
    const topic = await Topic.create({title, description, userEmail: user.email})

    res.json(topic)
}

const getTopics = async (req, res) => {
    const topics = await Topic.findAll();

    res.json(topics)
}



const deleteTopic = async(req,res)=>{
    const id = Number(req.params.id)
    const user = req.user
    // check if topic with certain id exists in the database
    const topicExists = await Topic.findByPk(id)

    if(!topicExists){
        return res.sendStatus(404)
    }
    
    if((topicExists.userEmail !== user.email) && (user.role !== 'Admin')){
        return res.sendStatus(403)
    }
    try{
        const topic= await Topic.destroy({where: 
            {id}
        });
        res.json({message:"Successfully deleted"})
    } catch(e){
        res.sendStatus(500)
    }

}



const updateTopic=async(req,res)=>{
    const id= Number(req.params.id)
    const {title,description}= req.body;
    const user = req.user
    // check if topic with certain id exists in the database
    const topicExists = await Topic.findByPk(id)

    if(!topicExists){
        return res.sendStatus(404)
    }
    if( title == "" || description == ""){
        return res.status(400).json({error: "Fields cannot be Empty"})
    }
    if(user.role != 'Admin'){
        if((topicExists.userEmail !== user.email)){
            return res.sendStatus(403)
        }
    }

    const topic=await Topic.update({title,description},
        {where:
            {id}
        });
    res.json({message:"topic updated"})
}



const getTopicsById = async (req,res) => {
    const id= Number(req.params.id)
    
    const user = req.user

    const topic = await Topic.findByPk(id)

    if(!topic){
        return res.status(404).json({ error: "Topic Not Found"})
    }

        res.json(topic)
}

const searchTopics = async (req, res) => {
  try{
    const users = req.user;
    const { title } = req.query;

    const topics = await Topic.findAll({
        where : {
            title : {[Op.like]: `%${title}%`}
        }
    })
    res.json(topics)

  } catch(error){
    res.status(500).json({error: "Internal Server Error"})
  }
       
}


module.exports = {
    postTopic,
    getTopics,
    deleteTopic,
    updateTopic,
    getTopicsById,
    searchTopics
}