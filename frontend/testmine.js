{
    "questionnaireID": "QQ001",
    "questionnaireTitle": "Έρευνα ΣΗΜΜΥ του ΕΜΠ",
    "keywords": [
        "engineering",
        "students"
    ],
    "questions": [{
            "qID": "P00",
            "qtext": "Σε ποιο εξάμηνο φοιτάτε;",
            "required": "TRUE",
            "type": "profile",
            "options": [{
                    "optID": "P00A1",
                    "opttxt": "1ο-5ο",
                    "nextqID": "P01"
                },
                {
                    "optID": "P00A2",
                    "opttxt": "6ο-9ο",
                    "nextqID": "P02"
                },
                {
                    "optID": "P00A3",
                    "opttxt": "10ο+",
                    "nextqID": "P03"
                }
            ]
        },
        {
            "qID": "P01",
            "qtext": "Ποια κατεύθυνση νομίζετε θα σας ταίριαζε περισσότερο;",
            "required": "TRUE",
            "type": "profile",
            "options": [{
                    "optID": "P01A1",
                    "opttxt": "Πληροφορικής",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P01A2",
                    "opttxt": "Τηλεπικοινωνιών",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P01A3",
                    "opttxt": "Ηλεκτρονικής",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P01A4",
                    "opttxt": "Ενέργειας",
                    "nextqID": "Q00"
                }
            ]
        },
        {
            "qID": "P02",
            "qtext": "Ποια κατεύθυνση έχετε επιλέξει;",
            "required": "TRUE",
            "type": "profile",
            "options": [{
                    "optID": "P02A1",
                    "opttxt": "Πληροφορικής",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P02A2",
                    "opttxt": "Τηλεπικοινωνιών",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P02A3",
                    "opttxt": "Ηλεκτρονικής",
                    "nextqID": "Q00"
                },
                {
                    "optID": "P02A4",
                    "opttxt": "Ενέργειας",
                    "nextqID": "Q00"
                }
            ]
        },
        {
            "qID": "P03",
            "qtext": "Έχετε ξεκινήσει την πτυχιακή σας;",
            "required": "TRUE",
            "type": "profile",
            "options": [{
                    "optID": "P03A1",
                    "opttxt": "Ναι",
                    "nextqID": "P02"
                },
                {
                    "optID": "P03A2",
                    "opttxt": "Όχι",
                    "nextqID": "P02"
                }
            ]
        },
        {
            "qID": "P04",
            "qtext": "Σε περίπτωση που χρειαστεί να επικοινωνήσουμε μαζί σας, μπορείτε προαιρετικά να γράψετε το e-mail σας:",
            "required": "FALSE",
            "type": "profile",
            "options": [{
                "optID": "P04TXT",
                "opttxt": "<open string>",
                "nextqID": null
            }]
        },
        {
            "qID": "Q00",
            "qtext": "Συνήθως, πόσο απο τον προσωπικό σας χρόνο αφιερώνετε για τη σχολή κάθε εβδομάδα;",
            "required": "TRUE",
            "type": "question",
            "options": [{
                    "optID": "Q00A1",
                    "opttxt": "<10 ώρες",
                    "nextqID": "Q01"
                },
                {
                    "optID": "Q00A2",
                    "opttxt": "10-20 ώρες",
                    "nextqID": "Q01"
                },
                {
                    "optID": "Q00A3",
                    "opttxt": "20-30 ώρες",
                    "nextqID": "Q01"
                },
                {
                    "optID": "Q00A4",
                    "opttxt": "30+ ώρες",
                    "nextqID": "Q01"
                }
            ]
        },
        {
            "qID": "Q01",
            "qtext": "Κατά πόσο η σχολή ανταποκρίνεται στις προσδοκίες που είχατε πριν εισαχθείτε;",
            "required": "TRUE",
            "type": "question",
            "options": [{
                    "optID": "Q01A1",
                    "opttxt": "Πολύ λίγο",
                    "nextqID": "Q02"
                },
                {
                    "optID": "Q01A2",
                    "opttxt": "Λίγο",
                    "nextqID": "Q02"
                },
                {
                    "optID": "Q01A3",
                    "opttxt": "Ουδέτερα",
                    "nextqID": "Q02"
                },
                {
                    "optID": "Q01A4",
                    "opttxt": "Πολύ",
                    "nextqID": "Q02"
                },
                {
                    "optID": "Q01A5",
                    "opttxt": "Πάρα πολύ",
                    "nextqID": "Q02"
                },
                {
                    "optID": "Q01A6",
                    "opttxt": "Δεν ξέρω / Δεν απαντώ",
                    "nextqID": "Q02"
                }
            ]
        },
        {
            "qID": "Q02",
            "qtext": "Θα χαρακτηρίζατε τη σχολή:",
            "required": "TRUE",
            "type": "question",
            "options": [{
                    "optID": "Q02A1",
                    "opttxt": "Πολύ εύκολη",
                    "nextqID": "P04"
                },
                {
                    "optID": "Q02A2",
                    "opttxt": "Εύκολη",
                    "nextqID": "P04"
                },
                {
                    "optID": "Q02A3",
                    "opttxt": "Τυπικής δυσκολίας",
                    "nextqID": "P04"
                },
                {
                    "optID": "Q02A4",
                    "opttxt": "Δύσκολη",
                    "nextqID": "P04"
                },
                {
                    "optID": "Q02A5",
                    "opttxt": "Πολύ δύσκολη",
                    "nextqID": "P04"
                }
            ]
        }
    ]
}