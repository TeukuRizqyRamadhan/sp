import ExportData from "./ExportData";

const ExportDataModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-contrast-40 bg-opacity-50 flex items-center justify-center">
            <ExportData onClose={onClose} />
        </div>
    );
};

export default ExportDataModal;
