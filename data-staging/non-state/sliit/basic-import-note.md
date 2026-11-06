# Basic programme import

Following the user's decision to keep the first version simple, 24 fact sheets from `source-report.md` are now displayed as **collected programme information**, with reported fees and a current-intake confirmation note.

The earlier correction review remains useful for later improvements; it is not a requirement to complete every field before displaying the basic listings.

- Generator: `scripts/build-sliit-basic.py`.
- Client data: `src/data/nonState/sliit-basic.json`.
- Editable export: `basic-programmes.csv` in this staging folder.
- Missing values remain empty in the dataset and appear as “Contact institution”.
- No recognition/accreditation/loan-approval badges are generated.
- Foreign transfer costs are distinguished from local fees. International-only fee data does not populate missing domestic tuition.
- Semester fees are not automatically converted into fixed full-course totals.
- The data is attributed to the supplied report; it is not labelled independently verified.
- Earlier programme entries for other institutions are restored with their research attribution. Older SLIIT entries are replaced by these 24 records to avoid duplicate versions.

The original research document is unchanged. No UGC records, cutoff values or admission evaluator rules are modified by this import.
