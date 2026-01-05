import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  pending: 'bg-[#FF9500]/10 text-[#FF9500]',
  in_progress: 'bg-[#007AFF]/10 text-[#007AFF]',
  resolved: 'bg-[#34C759]/10 text-[#34C759]',
  rejected: 'bg-[#FF3B30]/10 text-[#FF3B30]',
};

const ComplaintDetailModal = ({ complaint, onClose }) => {
  return (
    <AnimatePresence>
      {complaint && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-6 sm:p-8 w-full max-w-2xl relative border border-[#D2D2D7] max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#86868B] hover:text-[#1D1D1F] text-xl transition-colors p-1 hover:bg-[#FBFBFD] rounded-lg"><FaTimes /></button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 pr-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] break-words">{complaint.title}</h2>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${statusColors[complaint.status] || 'bg-[#86868B]/10 text-[#86868B]'}`}>{complaint.status.replace('_', ' ')}</span>
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="text-[#86868B]">Submitted by: <span className="font-medium text-[#1D1D1F]">{complaint.user?.name || 'N/A'}</span></div>
              <div className="text-[#86868B]">Category: <span className="font-medium text-[#1D1D1F]">{complaint.category?.name || 'N/A'}</span></div>
              {complaint.disco && (
                <div className="text-[#86868B]">DISCO: <span className="font-medium text-[#1D1D1F]">{complaint.disco}</span></div>
              )}
              {(complaint.meterNumber || complaint.accountNumber) && (
                <div className="text-[#86868B] space-x-3">
                  {complaint.meterNumber && (
                    <span>Meter No: <span className="font-medium text-[#1D1D1F]">{complaint.meterNumber}</span></span>
                  )}
                  {complaint.accountNumber && (
                    <span>Account No: <span className="font-medium text-[#1D1D1F]">{complaint.accountNumber}</span></span>
                  )}
                </div>
              )}
              {(complaint.address || complaint.state || complaint.lga) && (
                <div className="text-[#86868B]">Location: <span className="font-medium text-[#1D1D1F]">{complaint.address}{complaint.lga ? `, ${complaint.lga}` : ""}{complaint.state ? `, ${complaint.state}` : ""}</span></div>
              )}
              {complaint.feederOrTransformer && (
                <div className="text-[#86868B]">Feeder/Transformer: <span className="font-medium text-[#1D1D1F]">{complaint.feederOrTransformer}</span></div>
              )}
              {complaint.phoneNumber && (
                <div className="text-[#86868B]">Phone: <span className="font-medium text-[#1D1D1F]">{complaint.phoneNumber}</span></div>
              )}
              {complaint.assignedTo?.name && (
                <div className="text-[#86868B]">Assigned to: <span className="font-medium text-[#1D1D1F]">{complaint.assignedTo.name}</span></div>
              )}
              <div className="text-[#86868B]">Created: <span className="font-medium text-[#1D1D1F]">{new Date(complaint.createdAt).toLocaleString()}</span></div>
              <div className="text-[#86868B]">Updated: <span className="font-medium text-[#1D1D1F]">{new Date(complaint.updatedAt).toLocaleString()}</span></div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-[#1D1D1F] mb-2 text-sm uppercase tracking-wider">Description</h3>
              <div className="bg-[#FBFBFD] rounded-xl p-4 text-[#1D1D1F] whitespace-pre-line text-sm border border-[#D2D2D7]">{complaint.description}</div>
            </div>
            {complaint.resolutionNotes && (
              <div>
                <h3 className="font-semibold text-[#1D1D1F] mb-2 text-sm uppercase tracking-wider">Resolution Notes</h3>
                <div className="bg-[#34C759]/5 rounded-xl p-4 text-[#1D1D1F] whitespace-pre-line text-sm border border-[#34C759]/20">{complaint.resolutionNotes}</div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComplaintDetailModal; 