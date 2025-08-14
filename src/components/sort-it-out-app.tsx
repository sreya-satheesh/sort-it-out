"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ALGORITHMS, type SortingAlgorithmType, type SortingHistoryStep } from '@/lib/sorting-algorithms';
import { Play, Pause, SkipForward, RotateCcw, Bot, MoveDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_ARRAY = [15, 6, 2, 18, 9, 13, 5, 20, 1, 11];
const MIN_ARRAY_SIZE = 5;
const MAX_ARRAY_SIZE = 25;
const MAX_VALUE = 100;

export function SortItOutApp() {
  const [inputArrayStr, setInputArrayStr] = useState(DEFAULT_ARRAY.join(', '));
  const [currentArray, setCurrentArray] = useState<number[]>(DEFAULT_ARRAY);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmType>('Bubble Sort');
  const [history, setHistory] = useState<SortingHistoryStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(10);
  const { toast } = useToast();

  const generateAndSetHistory = useCallback((arr: number[]) => {
    const generateHistory = ALGORITHMS[algorithm].generateHistory;
    const newHistory = generateHistory(arr);
    setHistory(newHistory);
    setCurrentStep(0);
  }, [algorithm]);

  useEffect(() => {
    generateAndSetHistory(currentArray);
  }, [currentArray, algorithm, generateAndSetHistory]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying && currentStep < history.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500 / (speed / 50) + 50);
    } else if (isPlaying) {
        setIsPlaying(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentStep, history, speed]);

  const handleArraySubmit = () => {
    const stringArray = inputArrayStr.split(',').map(s => s.trim()).filter(s => s !== '');
    
    if (stringArray.length < MIN_ARRAY_SIZE || stringArray.length > MAX_ARRAY_SIZE) {
      toast({ title: "Invalid Array Size", description: `Array must have between ${MIN_ARRAY_SIZE} and ${MAX_ARRAY_SIZE} numbers.`, variant: "destructive" });
      return;
    }

    const newArray: number[] = [];
    for (const s of stringArray) {
        if (!/^\d+$/.test(s) || s.length > 3) { // also check for length to avoid very large numbers
            toast({ title: "Invalid Input", description: `'${s}' is not a valid number. Please use comma-separated numbers between 1 and ${MAX_VALUE}.`, variant: "destructive" });
            return;
        }
        const num = parseInt(s, 10);

        if (isNaN(num)) {
            toast({ title: "Invalid Number", description: `Could not parse '${s}'. Please enter valid numbers.`, variant: "destructive" });
            return;
        }

        if (num <= 0 || num > MAX_VALUE) {
            toast({ title: "Invalid Number Value", description: `Number ${num} is out of range. Please use numbers between 1 and ${MAX_VALUE}.`, variant: "destructive" });
            return;
        }
        newArray.push(num);
    }
    
    setCurrentArray(newArray);
    setIsPlaying(false);
  };
  
  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * (MAX_ARRAY_SIZE - MIN_ARRAY_SIZE + 1)) + MIN_ARRAY_SIZE;
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * MAX_VALUE) + 1);
    setInputArrayStr(randomArray.join(', '));
    setCurrentArray(randomArray);
    setIsPlaying(false);
  }

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handlePlayPause = () => {
    if (currentStep >= history.length - 1) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < history.length - 1) {
      setIsPlaying(false);
      setCurrentStep(currentStep + 1);
    }
  };

  const maxVal = useMemo(() => Math.max(...currentArray, 1), [currentArray]);
  const currentStepData = history[currentStep];

  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="algorithm-select">Sorting Algorithm</Label>
            <Select value={algorithm} onValueChange={(value: string) => {
              setAlgorithm(value as SortingAlgorithmType);
              setIsPlaying(false);
             }}>
              <SelectTrigger id="algorithm-select">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(ALGORITHMS).map(alg => (
                  <SelectItem key={alg} value={alg}>{alg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="array-input">Custom Array (comma-separated)</Label>
            <div className='flex gap-2'>
              <Input id="array-input" value={inputArrayStr} onChange={(e) => setInputArrayStr(e.target.value)} placeholder="e.g., 5, 3, 8, 4, 2" />
              <Button onClick={handleArraySubmit}>Set</Button>
            </div>
            <Button variant="outline" className='w-full' onClick={generateRandomArray}>
                <Bot className="mr-2" /> Generate Random Array
            </Button>
          </div>
          
          <div className="space-y-3 pt-4">
             <Label>Animation Controls</Label>
             <div className="flex items-center justify-around gap-2 bg-muted p-2 rounded-lg">
                <Button variant="ghost" size="icon" onClick={handlePlayPause} disabled={!history.length} className="text-foreground hover:bg-primary/20">
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleStepForward} disabled={!history.length || isPlaying || currentStep === history.length - 1} className="text-foreground hover:bg-primary/20">
                    <SkipForward />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReset} disabled={!history.length} className="text-foreground hover:bg-primary/20">
                    <RotateCcw />
                </Button>
             </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="speed-slider">Animation Speed</Label>
            <Slider id="speed-slider" min={10} max={100} step={10} value={[speed]} onValueChange={(value) => setSpeed(value[0])} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="flex flex-col p-4 bg-card border-border">
          <div className="flex-grow flex items-end justify-center gap-1 w-full min-h-[50px]">
            {currentStepData?.array.map((value, index) => {
              const { comparing, swapping, sorted, auxiliary, shifting } = currentStepData;
              const isComparing = comparing.includes(index);
              const isSwapping = swapping.includes(index);
              const isSorted = sorted.includes(index);
              const isPivot = auxiliary?.find(aux => aux.index === index);
              const isShifting = shifting?.elementIndex === index;
              const isShiftDestination = shifting?.destinationIndex === index;

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full relative group">
                   <div className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                     {isShifting && (
                        <div className="w-8 h-8 rounded-full border-4 border-fuchsia-400 animate-pulse"></div>
                     )}
                     {isShiftDestination && <MoveDown className="text-teal-400 w-8 h-8" />}
                   </div>
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all duration-300 ease-in-out relative z-10",
                      isPivot ? 'bg-fuchsia-500' :
                      isComparing ? 'bg-yellow-400' : 
                      isSwapping ? 'bg-red-500' :
                      isShifting ? 'bg-fuchsia-400' :
                      isShiftDestination ? 'bg-teal-400/50' :
                      isSorted ? 'bg-green-500' : 'bg-primary',
                    )}
                    style={{ height: `${(value / maxVal) * 100}%` }}
                    title={`${value}`}
                  ></div>
                   <span className="text-xs text-muted-foreground absolute -bottom-5">{value}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center justify-center mt-8 text-center">
            <p className="text-sm font-mono text-foreground h-10 flex items-center px-4">{currentStepData?.description || ' '}</p>
            <p className="text-sm text-muted-foreground mt-2">Step: {currentStep} / {history.length > 0 ? history.length - 1 : 0}</p>
          </div>
        </Card>
        
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-xl text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{ALGORITHMS[algorithm].description}</p>
            </CardContent>
        </Card>

        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-xl text-foreground">Complexity</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                    <p className="font-bold text-lg text-foreground">Time Complexity</p>
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <p>Best: <span className="font-mono text-primary">{ALGORITHMS[algorithm].complexity.time.best}</span></p>
                        <p>Average: <span className="font-mono text-primary">{ALGORITHMS[algorithm].complexity.time.average}</span></p>
                        <p>Worst: <span className="font-mono text-primary">{ALGORITHMS[algorithm].complexity.time.worst}</span></p>
                    </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="font-bold text-lg text-foreground">Space Complexity</p>
                    <p className="text-sm font-mono text-primary mt-2">{ALGORITHMS[algorithm].complexity.space}</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
