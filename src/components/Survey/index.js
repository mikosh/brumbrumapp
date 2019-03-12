import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as Survey from "survey-react";
import "survey-react/survey.css";
import 'bootstrap/dist/css/bootstrap.css'


class SurveyPage extends Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    console.log(this.props);
  }

  json = { title: "BrumBrum Carpooling Service Survey", showProgressBar: "top", pages: [
        {elements: [
            {
                type: "panel",
                name: "panel_demographics",
                title: "Demographics",
                elements: [
                    {
                        type: "radiogroup",
                        name: "gender",
                        title: "Gender:",
                        choices: ["Male", "Female", "Rather not say"],
                        isRequired: true,
                    },
                    {
                        type: "dropdown",
                        name: "age",
                        title: "Select your age...",
                        isRequired: true,
                        choices: ["17-24", "25-34", "35-44", "45-54", "55-64", "65+"]
                    },
                    {
                        type: "dropdown",
                        name: "country",
                        title: "Select your country...",
                        isRequired: true,
                        choicesByUrl: {
                            url: "https://restcountries.eu/rest/v2/region/Europe",
                            valueName: "name"
                        }
                    },
                    {
                        type: "radiogroup",
                        name: "driver",
                        title: "Do you own a vehicle?",
                        choices: ["Yes", "No"],
                        isRequired: true,
                    },
                ]
            }

        ]},
        {elements: [
            {
                type: "panel",
                name: "panel_carpooling",
                title: "Carpooling service",
                elements: [
                    {
                        type: "radiogroup",
                        name: "carpooled",
                        title: "Have you ever used carpooling service (either offered a ride in your vehicle or took a ride in others' vehicle)?",
                        choices: ["Yes", "No"],
                        isRequired: true,
                    },
                    {
                        type: "radiogroup",
                        name: "carpooling_reason",
                        title: "What would be your primary reason for using a carpooling service?",
                        isRequired: true,
                        choices: ["Save travel costs", "Meet interesting people", "No other travel alternative", "Travel in a more sustainable way", "Avoid looking for a parking space", "Travel faster", "Travel more convenient"]
                    }
                ]
            }
        ]},
        {elements: [
            {
                type: "panel",
                name: "panel_carpooling",
                title: "Trust in Carpooling service",
                elements: [
                    {
                       type: "checkbox",
                       name: "barriers",
                       title: "What are the potential barriers for you to use a carpooling service?",
                       isRequired: true,
                       hasOther: true,
                       choices: [
                        "Lack of safety",
                        "Unreliable",
                        "Unavailable for my trip",
                        "Lack of flexibility",
                        "No barriers"

                       ],
                       otherText: "Other (please describe)"
                    },
                    {
                      type: "checkbox",
                      name: "companion_info",
                      title: "What information would you require about traveling companion from a security and comfort perspective?",
                      isRequired: true,
                      hasOther: true,
                      choices: [
                       "User profile",
                       "User verfication (Phone / Facebook profile)",
                       "Rating history",
                       "Activity history",
                       "Type of vehicle",
                       "Luggage allowance",
                      ],
                      otherText: "Other (please describe)"
                    }
                ]
            }
        ]},
        {elements: [
            {
                type: "panel",
                name: "panel_carpooling",
                title: "Trust in Carpooling service",
                elements: [
                    {
                      type: "rating",
                      name: "post_a_trip",
                      title: "On a scale of 1 to 5, how comfortable would you be sharing your trip with a stranger?",
                      isRequired: true,
                      mininumRateDescription: "Very uncomfortable",
                      maximumRateDescription: "Very comfortable"
                    },
                    {
                      type: "rating",
                      name: "book_a_trip",
                      title: "On a scale of 1 to 5, how comfortable would you be getting a ride from a stranger?",
                      isRequired: true,
                      mininumRateDescription: "Very uncomfortable",
                      maximumRateDescription: "Very comfortable"
                    }
                ]
            }
        ]}

    ]};

  onComplete = (survey, options) => {
   //Write survey results into database

   this.props.firebase.survey().add({
     gender: JSON.stringify(survey.data.gender),
     age: JSON.stringify(survey.data.age),
     country: JSON.stringify(survey.data.country),
     driver: JSON.stringify(survey.data.driver),
     carpooled: JSON.stringify(survey.data.carpooled),
     carpooling_reason: JSON.stringify(survey.data.carpooling_reason),
     barriers: JSON.stringify(survey.data.barriers),
     companion_info: JSON.stringify(survey.data.companion_info),
     post_a_trip: JSON.stringify(survey.data.post_a_trip),
     book_a_trip: JSON.stringify(survey.data.book_a_trip)

   }).then((docRef) => {
     console.log("Survey submitted.")
   })
   .catch((error) => {
     console.error("Error adding document: ", error);
   });


   console.log(JSON.stringify(survey.data.companion_info))
   console.log("Survey results: " + JSON.stringify(survey.data));
  }

  render() {

    var model = new Survey.Model(this.json);
    return (
      <div className="container">
        <div className="page">
          <Survey.Survey model={model} onComplete={this.onComplete}/>
        </div>
      </div>
    );
  }

}

export default withFirebase(SurveyPage);
