from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionTrackPregnancyStage(Action):
    def name(self) -> Text:
        return "action_track_pregnancy_stage"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        trimester = tracker.get_slot("trimester")
        if not trimester:
            dispatcher.utter_message(text="Please let me know which trimester you're in so I can provide more specific information.")
            return []

        return [SlotSet("trimester", trimester)]

class ActionProvideHealthTips(Action):
    def name(self) -> Text:
        return "action_provide_health_tips"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        trimester = tracker.get_slot("trimester")
        
        tips = {
            "first": "First trimester tips: Take prenatal vitamins, get plenty of rest, and stay hydrated.",
            "second": "Second trimester tips: Start pregnancy exercises, eat balanced meals, and prepare for baby movements.",
            "third": "Third trimester tips: Practice birth breathing, prepare hospital bag, and monitor baby movements."
        }

        if trimester and trimester in tips:
            dispatcher.utter_message(text=tips[trimester])
        else:
            dispatcher.utter_message(text="Here are general pregnancy health tips: Stay active, eat well, and get regular check-ups.")

        return []

class ActionCheckSymptomSeverity(Action):
    def name(self) -> Text:
        return "action_check_symptom_severity"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        # Get the latest message from the user
        message = tracker.latest_message.get("text", "")

        # Define severe symptoms that require immediate attention
        severe_symptoms = [
            "bleeding", "severe pain", "contractions", "water broke",
            "decreased movement", "fever", "severe headache", "vision changes"
        ]

        # Check if any severe symptoms are mentioned
        for symptom in severe_symptoms:
            if symptom in message.lower():
                dispatcher.utter_message(
                    text="This symptom requires immediate medical attention. Please contact your healthcare provider or go to the emergency room."
                )
                return []

        dispatcher.utter_message(
            text="While this symptom is common during pregnancy, if it becomes severe or you're concerned, please consult your healthcare provider."
        )
        return []