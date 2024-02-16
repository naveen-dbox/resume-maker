const { ObjectId } = require("mongodb")

const MessagesDAO = require("../models/dao/messages_dao");
const Resumes_DAO = require("../models/dao/resumes_dao");

const messages_dao = new MessagesDAO();
const resumes_dao = new Resumes_DAO();

async function upload_message(document) {
  try {
      const response = await messages_dao.insert(document);
      return response;
  } catch (error) {
      throw new Error("Error Sending Message");
  }
}

async function get_resumes_by_ids(resume_ids){
    try {
        const filter = { _id: { $in: resume_ids } }
        const response = await resumes_dao.get_resumes(filter);
        return response;
    } catch (error) {
        console.log(error);
        throw new Error("Error Fetching Resumes");
    }
}

exports.base = (req, res, next) => {
    res.render('index', { title: 'Express' });
}

exports.send_message = async (req, res, next) => {
    try {
        const result = await upload_message(req.body);
        if (result.acknowledged === true && result.insertedId != null) {
            res.status(200).json({ status: 'success', message: 'Message sent successfully.' });
        } else {
            res.status(403).json({ status: 'error', message: 'Failed to send message.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
}

exports.resumes = async (req, res, next) => {
    filter = {}
    if(req.query.filter && req.query.filter!=""){
        filter = {tags: req.query.filter}
    }
    else{
        req.query.filter="all"
    }
    let resumeIds = await resumes_dao.get_all_resume_ids(filter);
    resumeIds = resumeIds.map(resumeIdObj => resumeIdObj._id);
        
    // Pagination logic
    const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not specified
    const limit = 8; // Maximum number of resumes per page
    const totalResumes = resumeIds.length;
    const totalPages = Math.ceil(totalResumes / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit - 1, totalResumes - 1);

    // Fetch resumes for the current page
    const resumeIdsPage = resumeIds.slice(startIndex, endIndex + 1);
    const resumes = await get_resumes_by_ids(resumeIdsPage);

    res.render("resumes", { 
        resumes: resumes,
        currentPage: page,
        totalPages: totalPages,
        filter: req.query.filter
    });
}

exports.resume = async (req, res, next) => {
    resume = await resumes_dao.get_resume({_id: new ObjectId(req.query.resumeId) })
    console.log(resume.name);
    res.render("resume", { 
        resume: resume
    });
}