const { where } = require("sequelize");
const User = require("../models/user.model");
const Announcement = require("../models/announcement.model")

const postAnnouncement = async (req,res) => {
    const { subject, details } = req.body;
   // const user = req.user;
    const announcementExists = await Announcement.findOne({
        where : {
            subject
        }
    });

    if(announcementExists){
        return res.status(400).json({error :"Subject exists"})
    }
    const announcement = await Announcement.create({subject,details})

    res.json(announcement)
}

const getAnnouncements = async (req, res) =>{
    const announcement = await Announcement.findAll();
    res.json(announcement)
}

const deleteAnnouncements = async (req,res) => {
    const id = Number(req.params.id)
    const announcementExists = await Announcement.findByPk(id)

    if(!announcementExists){
        return res.status(404).json({error: "Not found"})

    }
    try{
        const announcement = await Announcement.destroy({

            where:{id}
        });
        res.json({message: "Successfully deleted"})
    } catch (e) {
        res.sendStatus(500)
    }
}


const updateAnnouncements = async ( req,res) => {
    const id = Number(req.params.id)
    const {subject,details} = req.body;

    const announcementExists = await Announcement.findByPk(id)

    if(!announcementExists){
        return res.status(404).json({error: "Announcement Not found"})

    }

    const announcement = await Announcement.update({subject,details},
    {where:
        {id}
    });
    res.json({message : "Announcement Updated"})
}
module.exports = {
    postAnnouncement,
    getAnnouncements,
    deleteAnnouncements,
    updateAnnouncements
}