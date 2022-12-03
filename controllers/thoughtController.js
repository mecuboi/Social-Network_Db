const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
    .select('-__v')
      .populate('reactions')
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate('reactions')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { username: thought.username },
          { $push: { thoughts: thought._id } },
          { runValidators: true, new: true }
        );
      }
      )
      .then(() => res.json({ message: 'Thought succesfully created' }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      });
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'thought deleted!' })
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      })
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(reaction)
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      });
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json({ message: 'reaction has been succesfully deleted' })
      )
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      });
  },

}
