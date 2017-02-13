/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
  .controller('HelpCtrl', function ($scope, services,$location,HelpFactory) {

    /*$scope.titles = []
    services.staticContent(0, function (response) {


      if (response.response_status == '1') {
        $scope.titles = response.response_data.staticcontent;
      }

    });*/


    var singingUp = {
      content: [
        'Downlaod Cleanosuar for iOS',
        'Download Cleanosur for Android',
        'Creating a Cleanosaur Account',
        'Requesting and Accepting a Cleanosaur CLean',
        'Error Adding a Payment method',
        "I can't update my mobile and e-mail",
        'My e-mail and phone number is in use when I sign Up',
        "i'am not receiving verification message"
      ]
    }

    var legalPrivacy = {
      content: [
        'Terms and Conditions',
        'Safety and Security',
        'Insaurance'
      ]
    }
    var policies = {
      content: [
        'Can I schedule a clean?',
        'Can I request a specific cleaner?',
        'Can I request a clean for friends?',
        'Is there trip limits on time and distance',
        'Missed cleans and events',
        'Am I charged for cancelling clean?',
        'Cleaning fees'
      ]
    }
    var faresCalculated = {
      content: [
        'Understanding Cleaning Charges',
        'Can I tip my Cleanosaur?',
        'Booking fee',
        'Additional Charges'
      ]
    }

    var payment = {
      content: [
        'Understanding Cleaning Charges',
        'Can I tip my Cleanosaur?',
        'Booking fee',
        'Additional Charges',
        'Add Cash'
      ]
    }
    var pickingPaymentMethod = {
      content: [
        'Adding a new Payment Method',
        'Delete a payment method',
        'Add a stripe account',
        'Delete a stripe account'
      ]
    }

    var promotion = {
      content: [
        'How to earn a free cleans',
        'How to view current promotions',
        'Cleaner Referral Program',
        'Customer Referral Program'
      ]
    }

    var accesibility = {
      content: [
        'How to select Cleanosaur',
        'How to select location',
        'How to select work order',
        'How to create profile'
      ]
    }

    var accountPayment = {
      content: [
        "I can't sing in and request a clean",
        'Account settings and ratings',
        'Receipt and billing issues',
        'Adding a payment Option',
        'I have an unknown charge',
        'Delete my account'
      ]
    }

    var cantSignIn = {
      content: [
        "Forgot my password",
        "I can't login to my account",
        "Can't request a clean",
        'I want to reactivate my account',
        'My password reset is not working',
        "I didn't receive my password reset email"
      ]
    }

    var accountSetting = {
      content: [
        "How do I update my profile?",
        "Change the name on my account",
        "How to change the app's language setting?",
        'How can I change my location settings',
        'How to edit favourite places',
        "How do I sign out of app?",
        "I'd like to know my rating",
        'How is my rating determined?',
        'Delete my Cleanosaur Account',
        "I can't update my phone number",
        'How to manage emergency contacts'
      ]
    }

    var billingIssues = {
      content: [
        "How to review and download receipt?",
        "How to get a receipt of my clean?",
        "I am not receiving receipts?",
        'How to edit receipts',
      ]
    }

    var unknownCharges = {
      content: [
        "Pending chages",
        "My account shows identical charges",
        "My account has an unrecognized charge",
        'My account may be compromised',
      ]
    }

    var cleanWithCleanosaur = {
      content: [
        "Signing up to clean",
        "Requirements for becoming a Cleanosaur",
        "Do I need Insurance",
        "How do Cleanosaur's receive payment?",
        "Can I clean if I don't own a vehicle"
      ]
    }

    var eventInquireis = {
      content: [
        "Cleanosaur Events",
        "Press Inquiries",
        "Do I need Insurance",
        "Report an accident or claim to Cleanosaur",
        "Can I clean if I don't own a vehicle"
      ]
    }
    var cleanosuarOverview = {
      content: [
        {
          title: 'How does Cleanosaur works?',
          child: undefined
        },
        {
          title: 'Can I tip my Cleanosaur?',
          child: undefined
        }
        ,
        {
          title: 'Is Cleanosaur Always Available?',
          child: undefined
        }
        ,
        {
          title: 'Is Cleanosaur Available in my City?',
          child: undefined
        },
        {
          title: 'Is Cleanousar Available Internationally',
          child: undefined
        }
        ,
        {
          title: 'Is there a Minimun age for Cleanosaur',
          child: undefined
        }

      ]
    }
    var guideToClenosur = {
      content: [
        {
          title: 'Cleanosaur Overview',
          child: cleanosuarOverview
        },
        {
          title: 'Singing up',
          child: singingUp
        },
        {
          title: 'Legal and Privacy',
          child: legalPrivacy
        },
        {
          title: 'Policies',
          child: policies
        },
        {
          title: 'How fares are calculated',
          child: faresCalculated
        },
        {
          title: 'Payment',
          child: payment
        },
        {
          title: 'Picking up method',
          child: pickingPaymentMethod
        },
        {
          title: 'Promotions',
          child: promotion
        }
      ]
    }
    var help = {
      lastClean: {},
      content: [
        {
          title: 'Cleans and Cost Review',
          child: undefined
        },
        {
          title: 'A Guide to Cleanosaur',
          child: guideToClenosur
        },
        {
          title: 'Accessibility',
          child: cleanosuarOverview
        },
        {
          title: 'Account and payment',
          child: payment
        },
        {
          title: 'Clean with Cleanosaur',
          child: cleanWithCleanosaur
        },
        {
          title: 'Events and Inquiries',
          child: eventInquireis
        },
      ]
    }
    $scope.titles = help.content;
    $scope.pageTwo = HelpFactory.secondPage
    $scope.thirdPage = HelpFactory.thirdPage

    $scope.secondPage = function (child) {
      console.log(child)
      HelpFactory.secondPage = child.content;
      $location.url('page_two')
    }

    $scope.thirdPage = function (child) {
      //console.log(child)
      HelpFactory.thirdPage = child.content;
      $location.url('third_page')
    }
  }).factory('HelpFactory',function () {
   var secondPage = []
  var thirdPage = []

  return {
     secondPage : this.secondPage,
    thirdPage : this.thirdPage
  }
})
