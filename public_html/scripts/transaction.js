// Use strict
"use strict";


// Classes

// Transaction class
class Transaction {

	// Public
	
		// Constructor
		constructor(walletType, networkType, commit, walletKeyPath, received, recordedTimestamp, createdTimestamp, height, lockHeight, isCoinbase, status, amount, amountReleased, kernelExcess, identifier, switchType, display, kernelOffset, id, message, timeToLiveCutOffHeight, expired, confirmedTimestamp, fee, senderAddress, receiverAddress, receiverSignature, destination, spendableHeight, requiredNumberOfConfirmations, spentOutputs, changeOutputs, broadcast, rebroadcastMessage, fileResponse, pricesWhenRecorded, checked = false, canceled = false, keyPath = Transaction.NO_KEY_PATH) {
		
			// Set wallet type
			this.setWalletType(walletType);
			
			// Set network type
			this.setNetworkType(networkType);
			
			// Set commit
			this.setCommit(commit);
				
			// Set wallet key path
			this.setWalletKeyPath(walletKeyPath);
			
			// Set received
			this.setReceived(received);
			
			// Set recorded timestamp
			this.setRecordedTimestamp(recordedTimestamp);
			
			// Set created timestamp
			this.setCreatedTimestamp(createdTimestamp);
			
			// Set height
			this.setHeight(height);
			
			// Set lock height
			this.setLockHeight(lockHeight);
			
			// Set is coinbase
			this.setIsCoinbase(isCoinbase);
			
			// Set status
			this.setStatus(status);
			
			// Set amount
			this.setAmount(amount);
			
			// Set amount released
			this.setAmountReleased(amountReleased);
			
			// Set kernel excess
			this.setKernelExcess(kernelExcess);
			
			// Set identifier
			this.setIdentifier(identifier);
			
			// Set switch type
			this.setSwitchType(switchType);
			
			// Set display
			this.setDisplay(display);
			
			// Set kernel offset
			this.setKernelOffset(kernelOffset);
			
			// Set ID
			this.setId(id);
			
			// Set message
			this.setMessage(message);
			
			// Set time to live cut off height
			this.setTimeToLiveCutOffHeight(timeToLiveCutOffHeight);
			
			// Set expired
			this.setExpired(expired);
			
			// Set confirmed timestamp
			this.setConfirmedTimestamp(confirmedTimestamp);
			
			// Set fee
			this.setFee(fee);
			
			// Set sender address
			this.setSenderAddress(senderAddress);
			
			// Set receiver address
			this.setReceiverAddress(receiverAddress);
			
			// Set receiver signature
			this.setReceiverSignature(receiverSignature);
			
			// Set destination
			this.setDestination(destination);
			
			// Set spendable height
			this.setSpendableHeight(spendableHeight);
			
			// Set required number of confirmations
			this.setRequiredNumberOfConfirmations(requiredNumberOfConfirmations);
			
			// Set spent outputs
			this.setSpentOutputs(spentOutputs);
			
			// Set change outputs
			this.setChangeOutputs(changeOutputs);
			
			// Set broadcast
			this.setBroadcast(broadcast);
			
			// Set rebroadcast message
			this.setRebroadcastMessage(rebroadcastMessage);
			
			// Set file response
			this.setFileResponse(fileResponse);
			
			// Set prices when recorded
			this.setPricesWhenRecorded(pricesWhenRecorded);
			
			// Set checked
			this.setChecked(checked);
			
			// Set canceled
			this.setCanceled(canceled);
			
			// Set key path
			this.setKeyPath(keyPath);
		}
		
		// Get wallet type
		getWalletType() {
		
			// Return wallet type
			return this.walletType;
		}
		
		// Set wallet type
		setWalletType(walletType) {
		
			// Set wallet type
			this.walletType = walletType;
		}
		
		// Get network type
		getNetworkType() {
		
			// Return network type
			return this.networkType;
		}
		
		// Set network type
		setNetworkType(networkType) {
		
			// Set network type
			this.networkType = networkType;
		}
		
		// Get commit
		getCommit() {
		
			// Return commit
			return this.commit;
		}
		
		// Set commit
		setCommit(commit) {
		
			// Set commit
			this.commit = commit;
		}
		
		// Get wallet key path
		getWalletKeyPath() {
		
			// Return wallet key path
			return this.walletKeyPath;
		}
		
		// Set wallet key path
		setWalletKeyPath(walletKeyPath) {
		
			// Set wallet key path
			this.walletKeyPath = walletKeyPath;
		}
		
		// Get received
		getReceived() {
		
			// Return received
			return this.received;
		}
		
		// Set received
		setReceived(received) {
		
			// Set received
			this.received = received;
		}
		
		// Get recorded timestamp
		getRecordedTimestamp() {
		
			// Return recorded timestamp
			return this.recordedTimestamp;
		}
		
		// Set recorded timestamp
		setRecordedTimestamp(recordedTimestamp) {
		
			// Set recorded timestamp
			this.recordedTimestamp = recordedTimestamp;
		}
		
		// Get created timestamp
		getCreatedTimestamp() {
		
			// Return created timestamp
			return this.createdTimestamp;
		}
		
		// Set created timestamp
		setCreatedTimestamp(createdTimestamp) {
		
			// Set created timestamp
			this.createdTimestamp = createdTimestamp;
		}
		
		// Get height
		getHeight() {
		
			// Return height
			return this.height;
		}
		
		// Set height
		setHeight(height) {
		
			// Set height
			this.height = height;
		}
		
		// Get lock height
		getLockHeight() {
		
			// Return lock height
			return this.lockHeight;
		}
		
		// Set lock height
		setLockHeight(lockHeight) {
		
			// Set lock height
			this.lockHeight = lockHeight;
		}
		
		// Get is coinbase
		getIsCoinbase() {
		
			// Return is coinbase
			return this.isCoinbase;
		}
		
		// Set is coinbase
		setIsCoinbase(isCoinbase) {
		
			// Set is coinbase
			this.isCoinbase = isCoinbase;
		}
		
		// Get status
		getStatus() {
		
			// Return status
			return this.status;
		}
		
		// Set status
		setStatus(status) {
		
			// Set status
			this.status = status;
		}
		
		// Get amount
		getAmount() {
		
			// Return amount
			return this.amount;
		}
		
		// Set amount
		setAmount(amount) {
		
			// Set amount
			this.amount = amount;
		}
		
		// Get amount released
		getAmountReleased() {
		
			// Return amount released
			return this.amountReleased;
		}
		
		// Set amount released
		setAmountReleased(amountReleased) {
		
			// Set amount released
			this.amountReleased = amountReleased;
		}
		
		// Get kernel excess
		getKernelExcess() {
		
			// Return kernel excess
			return this.kernelExcess;
		}
		
		// Set kernel excess
		setKernelExcess(kernelExcess) {
		
			// Set kernel excess
			this.kernelExcess = kernelExcess;
		}
		
		// Get identifier
		getIdentifier() {
		
			// Return identifier
			return this.identifier;
		}
		
		// Set identifier
		setIdentifier(identifier) {
		
			// Set identifier
			this.identifier = identifier;
		}
		
		// Get switch type
		getSwitchType() {
		
			// Return switch type
			return this.switchType;
		}
		
		// Set switch type
		setSwitchType(switchType) {
		
			// Set switch type
			this.switchType = switchType;
		}
		
		// Get display
		getDisplay() {
		
			// Return display
			return this.display;
		}
		
		// Set display
		setDisplay(display) {
		
			// Set display
			this.display = display;
		}
		
		// Get kernel offset
		getKernelOffset() {
		
			// Return kernel offset
			return this.kernelOffset;
		}
		
		// Set kernel offset
		setKernelOffset(kernelOffset) {
		
			// Set kernel offset
			this.kernelOffset = kernelOffset;
		}
		
		// Get ID
		getId() {
		
			// Return ID
			return this.id;
		}
		
		// Set ID
		setId(id) {
		
			// Set ID
			this.id = id;
		}
		
		// Get message
		getMessage() {
		
			// Return message
			return this.message;
		}
		
		// Set message
		setMessage(message) {
		
			// Set message
			this.message = message;
		}
		
		// Get time to live cut off height
		getTimeToLiveCutOffHeight() {
		
			// Return time to live cut off height
			return this.timeToLiveCutOffHeight;
		}
		
		// Set time to live cut off height
		setTimeToLiveCutOffHeight(timeToLiveCutOffHeight) {
		
			// Set time to live cut off height
			this.timeToLiveCutOffHeight = timeToLiveCutOffHeight;
		}
		
		// Get expired
		getExpired() {
		
			// Return expired
			return this.expired;
		}
		
		// Set expired
		setExpired(expired) {
		
			// Set expired
			this.expired = expired;
		}
		
		// Get confirmed timestamp
		getConfirmedTimestamp() {
		
			// Return confirmed timestamp
			return this.confirmedTimestamp;
		}
		
		// Set confirmed timestamp
		setConfirmedTimestamp(confirmedTimestamp) {
		
			// Set confirmed timestamp
			this.confirmedTimestamp = confirmedTimestamp;
		}
		
		// Get fee
		getFee() {
		
			// Return fee
			return this.fee;
		}
		
		// Set fee
		setFee(fee) {
		
			// Set fee
			this.fee = fee;
		}
		
		// Get sender address
		getSenderAddress() {
		
			// Return sender address
			return this.senderAddress;
		}
		
		// Set sender address
		setSenderAddress(senderAddress) {
		
			// Set sender address
			this.senderAddress = senderAddress;
		}
		
		// Get receiver address
		getReceiverAddress() {
		
			// Return receiver address
			return this.receiverAddress;
		}
		
		// Set receiver address
		setReceiverAddress(receiverAddress) {
		
			// Set receiver address
			this.receiverAddress = receiverAddress;
		}
		
		// Get receiver signature
		getReceiverSignature() {
		
			// Return receiver signature
			return this.receiverSignature;
		}
		
		// Set receiver signature
		setReceiverSignature(receiverSignature) {
		
			// Set receiver signature
			this.receiverSignature = receiverSignature;
		}
		
		// Get destination
		getDestination() {
		
			// Return destination
			return this.destination;
		}
		
		// Set destination
		setDestination(destination) {
		
			// Set destination
			this.destination = destination;
		}
		
		// Get spendable height
		getSpendableHeight() {
		
			// Return spendable height
			return this.spendableHeight;
		}
		
		// Set spendable height
		setSpendableHeight(spendableHeight) {
		
			// Set spendable height
			this.spendableHeight = spendableHeight;
		}
		
		// Get required number of confirmations
		getRequiredNumberOfConfirmations() {
		
			// Return required number of confirmations
			return this.requiredNumberOfConfirmations;
		}
		
		// Set required number of confirmations
		setRequiredNumberOfConfirmations(requiredNumberOfConfirmations) {
		
			// Set required number of confirmations
			this.requiredNumberOfConfirmations = requiredNumberOfConfirmations;
		}
		
		// Get spent outputs
		getSpentOutputs() {
		
			// Return spent outputs
			return this.spentOutputs;
		}
		
		// Set spent outputs
		setSpentOutputs(spentOutputs) {
		
			// Set spent outputs
			this.spentOutputs = spentOutputs;
		}
		
		// Get change outputs
		getChangeOutputs() {
		
			// Return change outputs
			return this.changeOutputs;
		}
		
		// Set change outputs
		setChangeOutputs(changeOutputs) {
		
			// Set change outputs
			this.changeOutputs = changeOutputs;
		}
		
		// Get broadcast
		getBroadcast() {
		
			// Return broadcast
			return this.broadcast;
		}
		
		// Set broadcast
		setBroadcast(broadcast) {
		
			// Set broadcast
			this.broadcast = broadcast;
		}
		
		// Get rebroadcast message
		getRebroadcastMessage() {
		
			// Return rebroadcast message
			return this.rebroadcastMessage;
		}
		
		// Set rebroadcast message
		setRebroadcastMessage(rebroadcastMessage) {
		
			// Set rebroadcast message
			this.rebroadcastMessage = rebroadcastMessage;
		}
		
		// Get file response
		getFileResponse() {
		
			// Return file response
			return this.fileResponse;
		}
		
		// Set file response
		setFileResponse(fileResponse) {
		
			// Set file response
			this.fileResponse = fileResponse;
		}
		
		// Get prices when recorded
		getPricesWhenRecorded() {
		
			// Return prices when recorded
			return this.pricesWhenRecorded;
		}
		
		// Set prices when recorded
		setPricesWhenRecorded(pricesWhenRecorded) {
		
			// Set prices when recorded
			this.pricesWhenRecorded = pricesWhenRecorded;
		}
		
		// Get checked
		getChecked() {
		
			// Return checked
			return this.checked;
		}
		
		// Set checked
		setChecked(checked) {
		
			// Set checked
			this.checked = checked;
		}
		
		// Get canceled
		getCanceled() {
		
			// Return canceled
			return this.canceled;
		}
		
		// Set canceled
		setCanceled(canceled) {
		
			// Set canceled
			this.canceled = canceled;
		}
		
		// Get key path
		getKeyPath() {
		
			// Return key path
			return this.keyPath;
		}
		
		// Set key path
		setKeyPath(keyPath) {
		
			// Set keyPath
			this.keyPath = keyPath;
		}
		
		// Unused commit
		static get UNUSED_COMMIT() {
		
			// Return unused commit
			return undefined;
		}
		
		// Unknown created timestamp
		static get UNKNOWN_CREATED_TIMESTAMP() {
		
			// Return unknown created timestamp
			return null;
		}
		
		// Unknown height
		static get UNKNOWN_HEIGHT() {
		
			// Return unknown height
			return null;
		}
		
		// Unknown lock height
		static get UNKNOWN_LOCK_HEIGHT() {
		
			// Return unknown lock height
			return null;
		}
		
		// No lock height
		static get NO_LOCK_HEIGHT() {
		
			// Return no lock height
			return undefined;
		}
		
		// Unknown status
		static get UNKNOWN_STATUS() {
		
			// Return unknown status
			return null;
		}
		
		// Status unspent
		static get STATUS_UNSPENT() {
		
			// Return status unspent
			return 0;
		}
		
		// Status spent
		static get STATUS_SPENT() {
		
			// Return status spent
			return Transaction.STATUS_UNSPENT + 1;
		}
		
		// Status locked
		static get STATUS_LOCKED() {
		
			// Return status locked
			return Transaction.STATUS_SPENT + 1;
		}
		
		// Status unconfirmed
		static get STATUS_UNCONFIRMED() {
		
			// Return status unconfirmed
			return Transaction.STATUS_LOCKED + 1;
		}
		
		// Unknown kernel excess
		static get UNKNOWN_KERNEL_EXCESS() {
		
			// Return unknown kernel excess
			return null;
		}
		
		// Unknown identifier
		static get UNKNOWN_IDENTIFIER() {
		
			// Return unknown identifier
			return null;
		}
		
		// Unknown switch type
		static get UNKNOWN_SWITCH_TYPE() {
		
			// Return unknown switch type
			return null;
		}
		
		// Unknown kernel offset
		static get UNKNOWN_KERNEL_OFFSET() {
		
			// Return unknown kernel offset
			return null;
		}
		
		// Unused kernel offset
		static get UNUSED_KERNEL_OFFSET() {
		
			// Return unused kernel offset
			return undefined;
		}
		
		// Unknown ID
		static get UNKNOWN_ID() {
		
			// Return unknown ID
			return null;
		}
		
		// Unused ID
		static get UNUSED_ID() {
		
			// Return unused ID
			return undefined;
		}
		
		// Unknown message
		static get UNKNOWN_MESSAGE() {
		
			// Return unknown message
			return null;
		}
		
		// No message
		static get NO_MESSAGE() {
		
			// Return no message
			return undefined;
		}
		
		// Unknown time to live cut off height
		static get UNKNOWN_TIME_TO_LIVE_CUT_OFF_HEIGHT() {
		
			// Return unknown time to live cut off height
			return null;
		}
		
		// No time to live cut off height
		static get NO_TIME_TO_LIVE_CUT_OFF_HEIGHT() {
		
			// Return no time to live cut off height
			return undefined;
		}
		
		// No confirmed timestamp
		static get NO_CONFIRMED_TIMESTAMP() {
		
			// Return no confirmed timestamp
			return undefined;
		}
		
		// Unknown fee
		static get UNKNOWN_FEE() {
		
			// Return unknown fee
			return null;
		}
		
		// No fee
		static get NO_FEE() {
		
			// Return no fee
			return undefined;
		}
		
		// Unknown sender address
		static get UNKNOWN_SENDER_ADDRESS() {
		
			// Return unknown sender address
			return null;
		}
		
		// No sender address
		static get NO_SENDER_ADDRESS() {
		
			// Return no sender address
			return undefined;
		}
		
		// Unknown receiver address
		static get UNKNOWN_RECEIVER_ADDRESS() {
		
			// Return unknown receiver address
			return null;
		}
		
		// No receiver address
		static get NO_RECEIVER_ADDRESS() {
		
			// Return no receiver address
			return undefined;
		}
		
		// Unknown receiver signature
		static get UNKNOWN_RECEIVER_SIGNATURE() {
		
			// Return unknown receiver signature
			return null;
		}
		
		// No receiver signature
		static get NO_RECEIVER_SIGNATURE() {
		
			// Return no receiver signature
			return undefined;
		}
		
		// Unknown destination
		static get UNKNOWN_DESTINATION() {
		
			// Return unknown destination
			return null;
		}
		
		// Unused destination
		static get UNUSED_DESTINATION() {
		
			// Return unused destination
			return undefined;
		}
		
		// Unknown spendable height
		static get UNKNOWN_SPENDABLE_HEIGHT() {
		
			// Return unknown spendable height
			return null;
		}
		
		// Unknown required number of confirmations
		static get UNKNOWN_REQUIRED_NUMBER_OF_CONFIRMATIONS() {
		
			// Return unknown required number of confirmations
			return null;
		}
		
		// Unused spent outputs
		static get UNUSED_SPENT_OUTPUTS() {
		
			// Return unused spent outputs
			return undefined;
		}
		
		// Unused change outputs
		static get UNUSED_CHANGE_OUTPUTS() {
		
			// Return unused change outputs
			return undefined;
		}
		
		// Unknown rebroadcast message
		static get UNKNOWN_REBROADCAST_MESSAGE() {
		
			// Return unknown rebroadcast message
			return null;
		}
		
		// Unused file response
		static get UNUSED_FILE_RESPONSE() {
		
			// Return unused file response
			return undefined;
		}
		
		// Unknown prices when recorded
		static get UNKNOWN_PRICES_WHEN_RECORDED() {
		
			// Return unknown prices when recorded
			return null;
		}
		
		// Unused prices when recorded
		static get UNUSED_PRICES_WHEN_RECORDED() {
		
			// Return unused prices when recorded
			return undefined;
		}
		
		// No key path
		static get NO_KEY_PATH() {
		
			// Return no key path
			return null;
		}
}


// Main function

// Set global object's transaction
globalThis["Transaction"] = Transaction;
