<script>
export default {
template: require('../templates/description-template.html'),
// props, passed via custom element %description
props: ['descriptionText', 'wordLimit'],
data: function () {
  return {
    // limit description to number of words
     descriptionLimit: this.wordLimit,
    // read more/less links
     readMoreLink: true,
     readLessLink: false,
    //  Array for words in description
     inputWords: _.split(this.descriptionText, /\s+/)
    }
},
filters: {
  limitDescriptionFilter: function(description, wordLimit) {
    if (this.inputWords.length > wordLimit) {
        description = _.join(_.slice(this.inputWords, 0, wordLimit), ' ');
    }
    // Hide read more link if description <= description word limit
    else if (this.inputWords.length <= wordLimit) {
      this.readMoreLink = false;
    };
    return(description);
  }

},
methods: {
  showMoreDescription(){
    // set description limit to the number of words
    this.descriptionLimit = this.inputWords.length;
    // hide/show read more/less link
    this.readMoreLink = false;
    this.readLessLink = true;
  },
  showLessDescription(){
    // Reset description limit
    this.descriptionLimit = this.wordLimit;
    // hide/show read more/less link
    this.readMoreLink = true;
    this.readLessLink = false;
  }
}
}
</script>
