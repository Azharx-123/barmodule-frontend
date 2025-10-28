import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../css/PDFplayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFplayer = ({ pdfUrl, title }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.7);
  const [rotation, setRotation] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [pageInput, setPageInput] = useState("");
  const containerRef = useRef(null);
  const pdfDocumentRef = useRef(null);

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setScale(0.7);
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setErrorMessage("");
    pdfDocumentRef.current = pdfjs.getDocument(pdfUrl).promise;
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  const zoomIn = () => setScale((prev) => Math.min(3.5, prev + 0.1));
  const zoomOut = () => setScale((prev) => Math.max(0.07, prev - 0.1));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleSearch = async () => {
    if (!searchText || !pdfDocumentRef.current) return;

    const pdf = await pdfDocumentRef.current;
    const results = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item) => item.str).join(" ");

      if (text.toLowerCase().includes(searchText.toLowerCase())) {
        results.push(i);
      }
    }

    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    if (results.length > 0) {
      setPageNumber(results[0]);
    }
  };

  const navigateSearch = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex + direction;
    if (newIndex < 0) newIndex = searchResults.length - 1;
    if (newIndex >= searchResults.length) newIndex = 0;

    setCurrentSearchIndex(newIndex);
    setPageNumber(searchResults[newIndex]);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((prev) => Math.min(3.5, Math.max(0.07, prev * zoomFactor)));
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (pageNum && pageNum > 0 && pageNum <= numPages) {
      setPageNumber(pageNum);
      setPageInput("");
    }
  };

  const displayedScale = Math.round((scale / 0.7) * 100);

  return (
    <section className="pdf-player-section" data-aos="fade-up">
      <div className="pdf-container" ref={containerRef}>
        <h2 className="pdf-title">{title}</h2>

        <div className="pdf-toolbar">
          <div className="pdf-nav-controls">
            <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <ChevronLeft />
            </button>
            <span className="page-info">
              Page {pageNumber} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <ChevronRight />
            </button>
            <form onSubmit={handlePageInputSubmit} className="page-input-form">
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                min="1"
                max={numPages}
                placeholder="Go to"
              />
              <button type="submit">Go</button>
            </form>
          </div>

          <div className="pdf-view-controls">
            <button onClick={zoomOut} title="Zoom Out">
              <ZoomOut size={20} />
            </button>
            <span className="scale-info">{displayedScale}%</span>
            <button onClick={zoomIn} title="Zoom In">
              <ZoomIn size={20} />
            </button>
            <button onClick={rotate} title="Rotate">
              <RotateCw size={20} />
            </button>
          </div>

          <div className="pdf-search-controls">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search PDF..."
            />
            <button onClick={handleSearch}>
              <Search size={20} />
            </button>
            {searchResults.length > 0 && (
              <>
                <button onClick={() => navigateSearch(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <span>
                  {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <button onClick={() => navigateSearch(1)}>
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => {
                    setSearchText("");
                    setSearchResults([]);
                    setCurrentSearchIndex(-1);
                  }}
                >
                  <X size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className="pdf-viewer-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? "none" : "transform 0.3s ease",
            }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="enhanced-loading">
                  <p className="loading-text">Loading PDF...</p>
                  <div className="loading-bar">
                    <div className="loading-bar-progress"></div>
                  </div>
                </div>
              }
              error={
                <div className="error">
                  <p>
                    {errorMessage ||
                      "Error loading PDF. Please try again later."}
                  </p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                className="pdf-page"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PDFplayer;
