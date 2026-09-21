function requestEmergencyOverride() {

    const confirmed = confirm(
        "Emergency Override Protocol\n\n" +
        "Override is permitted only for a verified emergency " +
        "reported through the disaster management system.\n\n" +
        "Submit override request?"
    );

    if (!confirmed) {
        return;
    }

    const reason = prompt(
        "Enter emergency reason:"
    );

    if (!reason || reason.trim() === "") {

        alert(
            "Override rejected.\n" +
            "A valid emergency reason is required."
        );

        return;
    }

    alert(
        "Emergency override request submitted.\n\n" +
        "Reason: " + reason + "\n\n" +
        "Awaiting authorized officer verification."
    );

}